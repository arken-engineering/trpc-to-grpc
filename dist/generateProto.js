"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProtoFile = exports.zodToProtoType = void 0;
const zod_1 = require("zod");
const fs = __importStar(require("fs"));
const zodToProtoType = (zodType) => {
    if (zodType instanceof zod_1.ZodString) {
        return 'string';
    }
    else if (zodType instanceof zod_1.z.ZodNumber) {
        return 'int32'; // Assuming all numbers are int32 for simplicity
    }
    else if (zodType instanceof zod_1.z.ZodBoolean) {
        return 'bool';
    }
    else if (zodType instanceof zod_1.z.ZodArray) {
        const elementType = (0, exports.zodToProtoType)(zodType._def.type);
        return `repeated ${elementType}`;
    }
    else if (zodType instanceof zod_1.z.ZodObject) {
        const fields = Object.entries(zodType.shape).map(([key, value], index) => {
            return `  ${(0, exports.zodToProtoType)(value)} ${key} = ${index + 1};`;
        }).join('\n');
        return `{\n${fields}\n}`;
    }
    throw new Error(`Unsupported Zod type: ${zodType}`);
};
exports.zodToProtoType = zodToProtoType;
const generateProtoFile = (router, outputPath) => {
    const procedures = router._def.procedures;
    let protoMessages = {};
    let services = {};
    for (const [name, procedure] of Object.entries(procedures)) {
        // @ts-ignore
        const inputSchema = procedure._def.inputs[0];
        // @ts-ignore
        const outputSchema = procedure._def.output;
        const inputMessageName = `${name.charAt(0).toUpperCase() + name.slice(1)}Request`;
        const outputMessageName = `${name.charAt(0).toUpperCase() + name.slice(1)}Response`;
        protoMessages[inputMessageName] = `message ${inputMessageName} ${(0, exports.zodToProtoType)(inputSchema)}\n`;
        protoMessages[outputMessageName] = `message ${outputMessageName} ${(0, exports.zodToProtoType)(outputSchema)}\n`;
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
            services[packageName] = { definitions: '', packageNames: packageOptions.packages, options: packageOptions.options };
        }
        services[packageName].definitions += `  ${rpcType} ${name.charAt(0).toUpperCase() + name.slice(1)}(${inputMessageName}) returns (${outputMessageName});\n`;
    }
    const protoFileContent = Object.values(services).map(service => {
        const options = Object.entries(service.options).map(([key, value]) => `option ${key} = "${value}";`).join('\n');
        return `
syntax = "proto3";

${service.packageNames.map(pkg => `package ${pkg};`).join('\n')}
${options}

service ${service.packageNames[service.packageNames.length - 1].split('.').pop()} {
${service.definitions}
}

${Object.values(protoMessages).join('\n')}
    `;
    }).join('\n');
    fs.writeFileSync(outputPath, protoFileContent);
};
exports.generateProtoFile = generateProtoFile;
// generateProtoFile(appRouter, './proto/generated.proto');
//# sourceMappingURL=generateProto.js.map