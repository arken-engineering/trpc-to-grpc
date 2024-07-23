import {
  z,
  ZodTypeAny,
  ZodObject,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodArray,
  ZodOptional,
  ZodNullable,
  ZodDate,
  ZodEnum,
  ZodUnion,
  ZodLiteral,
  ZodRecord,
  ZodTuple,
  ZodMap,
  ZodSet,
  ZodEffects,
  ZodAny,
} from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const zodToProtoType = (zodType: ZodTypeAny): string => {
  if (zodType instanceof ZodString) {
    return 'string';
  } else if (zodType instanceof ZodNumber) {
    return 'int32'; // Assuming all numbers are int32 for simplicity
  } else if (zodType instanceof ZodBoolean) {
    return 'bool';
  } else if (zodType instanceof ZodDate) {
    return 'string'; // Dates can be represented as strings
  } else if (zodType instanceof ZodEnum) {
    return 'enum'; // Placeholder, you need to generate enum definitions
  } else if (zodType instanceof ZodLiteral) {
    return typeof zodType.value === 'number' ? 'int32' : 'string';
  } else if (zodType instanceof ZodUnion) {
    // Handle union types (use the first type for simplicity)
    return zodToProtoType(zodType._def.options[0]);
  } else if (zodType instanceof ZodOptional || zodType instanceof ZodNullable) {
    // Handle optional and nullable types
    return zodToProtoType(zodType.unwrap());
  } else if (zodType instanceof ZodArray) {
    const elementType = zodToProtoType(zodType._def.type);
    return `repeated ${elementType}`;
  } else if (zodType instanceof ZodObject) {
    const fields = Object.entries(zodType.shape)
      .map(([key, value], index) => {
        return `  ${zodToProtoType(value as ZodTypeAny)} ${key} = ${index + 1};`;
      })
      .join('\n');
    return `{\n${fields}\n}`;
  } else if (zodType instanceof ZodRecord) {
    return 'map<string, string>'; // Simplified handling for ZodRecord
  } else if (zodType instanceof ZodTuple) {
    // Simplified handling for ZodTuple
    return 'tuple'; // Placeholder, you need to handle tuples appropriately
  } else if (zodType instanceof ZodMap) {
    return 'map'; // Placeholder, you need to handle maps appropriately
  } else if (zodType instanceof ZodSet) {
    return 'repeated'; // Placeholder, you need to handle sets appropriately
  } else if (zodType instanceof ZodEffects) {
    // Handle ZodEffects by unwrapping the inner schema
    return zodToProtoType(zodType._def.schema);
  } else if (zodType instanceof ZodAny) {
    // Handle ZodAny
    return 'string'; // Simplified handling for ZodAny
  }

  console.log(zodType);
  throw new Error(`Unsupported Zod type: ${JSON.stringify(zodType)}`);
};

export const generateProtoFile = (router: any, outputPath: string) => {
  const procedures = router._def.procedures;

  let protoMessages: Record<string, string> = {};
  let services: Record<
    string,
    { definitions: string; packageName: string; options: Record<string, string> }
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

    let packageOptions = { packageName: 'none', options: {} };
    // @ts-ignore
    if (procedure._def.middlewares) {
      // @ts-ignore
      for (const middleware of procedure._def.middlewares) {
        // @ts-ignore
        console.log(middleware);
        if (middleware.name === 'packageMiddleware') {
          packageOptions = { ...packageOptions, ...(middleware.options || {}) };
        }
      }
    }

    const packageName = packageOptions.packageName;
    if (!services[packageName]) {
      services[packageName] = {
        definitions: '',
        packageName: packageOptions.packageName,
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
  
  package ${service.packageName};
  ${options}
  
  service ${service.packageName} {
  ${service.definitions}
  }
  
  ${Object.values(protoMessages).join('\n')}
      `;
    })
    .join('\n');

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, protoFileContent);
};
