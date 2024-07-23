import { ZodTypeAny } from 'zod';
export declare const zodToProtoType: (zodType: ZodTypeAny) => string;
export declare const generateProtoFile: (router: any, outputPath: string) => void;
