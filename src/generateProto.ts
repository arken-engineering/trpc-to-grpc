import { z, ZodTypeAny, ZodObject, ZodString, ZodNumber, ZodBoolean, ZodArray } from 'zod';
import * as fs from 'fs';

export const zodToProtoType = (zodType: ZodTypeAny): string => {
  if (zodType instanceof ZodString) {
    return 'string';
  } else if (zodType instanceof z.ZodNumber) {
    return 'int32'; // Assuming all numbers are int32 for simplicity
  } else if (zodType instanceof z.ZodBoolean) {
    return 'bool';
  } else if (zodType instanceof z.ZodArray) {
    const elementType = zodToProtoType(zodType._def.type);
    return `repeated ${elementType}`;
  } else if (zodType instanceof z.ZodObject) {
    const fields = Object.entries(zodType.shape)
      .map(([key, value]: any, index) => {
        return `  ${zodToProtoType(value)} ${key} = ${index + 1};`;
      })
      .join('\n');
    return `{\n${fields}\n}`;
  }
  throw new Error(`Unsupported Zod type: ${zodType}`);
};

export const generateProtoFile = (router: any, outputPath: string) => {
  const procedures = router._def.procedures;

  let protoMessages: Record<string, string> = {};
  let services: Record<
    string,
    { definitions: string; packageNames: string[]; options: Record<string, string> }
  > = {};

  for (const [name, procedure] of Object.entries(procedures)) {
    // @ts-ignore
    const inputSchema = procedure._def.inputs[0];
    // @ts-ignore
    const outputSchema = procedure._def.output;

    const inputMessageName = `${name.charAt(0).toUpperCase() + name.slice(1)}Request`;
    const outputMessageName = `${name.charAt(0).toUpperCase() + name.slice(1)}Response`;

    protoMessages[inputMessageName] = `message ${inputMessageName} ${zodToProtoType(
      inputSchema
    )}\n`;
    protoMessages[outputMessageName] = `message ${outputMessageName} ${zodToProtoType(
      outputSchema
    )}\n`;

    const rpcType = 'rpc';

    let packageOptions = { packages: [], options: {} };
    // @ts-ignore
    if (procedure._def.middlewares) {
      // @ts-ignore
      for (const middleware of procedure._def.middlewares) {
        if (middleware.name === 'packageMiddleware') {
          packageOptions = middleware.options;
        }
      }
    }

    const packageName = packageOptions.packages.join('.');
    if (!services[packageName]) {
      services[packageName] = {
        definitions: '',
        packageNames: packageOptions.packages,
        options: packageOptions.options,
      };
    }
    services[packageName].definitions += `  ${rpcType} ${
      name.charAt(0).toUpperCase() + name.slice(1)
    }(${inputMessageName}) returns (${outputMessageName});\n`;
  }

  const protoFileContent = Object.values(services)
    .map((service) => {
      const options = Object.entries(service.options)
        .map(([key, value]) => `option ${key} = "${value}";`)
        .join('\n');
      return `
syntax = "proto3";

${service.packageNames.map((pkg) => `package ${pkg};`).join('\n')}
${options}

service ${service.packageNames[service.packageNames.length - 1].split('.').pop()} {
${service.definitions}
}

${Object.values(protoMessages).join('\n')}
    `;
    })
    .join('\n');

  fs.writeFileSync(outputPath, protoFileContent);
};

// generateProtoFile(appRouter, './proto/generated.proto');
