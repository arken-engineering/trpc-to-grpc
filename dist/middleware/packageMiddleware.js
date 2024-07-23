"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.publicProcedure = exports.loggingMiddleware = exports.packageMiddleware = exports.t = void 0;
const server_1 = require("@trpc/server");
const transformer_1 = require("../transformer");
exports.t = server_1.initTRPC
    .context()
    .create({
    transformer: transformer_1.customTransformer,
});
const packageMiddleware = (input) => exports.t.middleware(async ({ ctx, next }) => {
    const packageOptions = {
        packages: input.packages,
        options: input.options,
    };
    ctx.packageOptions = packageOptions;
    return next({
        ctx,
    });
});
exports.packageMiddleware = packageMiddleware;
// Example: Logging middleware
const loggingMiddleware = () => exports.t.middleware(async ({ ctx, path, type, next }) => {
    console.log(`Request: ${type} ${path}`, ctx.packageOptions);
    const result = await next();
    console.log(`Response: ${type} ${path}`);
    return result;
});
exports.loggingMiddleware = loggingMiddleware;
exports.publicProcedure = exports.t.procedure;
exports.router = exports.t.router;
// (options: PackageOptions): MiddlewareFunction<any, any> => {
//   return async ({ ctx, next }) => {
//     return next({
//       ctx: {
//         ...ctx,
//         packageOptions: options,
//       },
//     });
//   };
// };
// // src/middleware/packageMiddleware.ts
// import { Middleware } from '@trpc/server';
// export const packageMiddleware: Middleware<any, any> = async ({ ctx, next }) => {
//   ctx.packageOptions = options
//   return next();
// };
// // src/middleware/packageMiddleware.ts
// import { Middleware } from '@trpc/server';
// interface PackageOptions {
//   packages: string[];
//   options: {
//     go_package: string;
//   };
// }
// export const packageMiddleware: Middleware<any, any, PackageOptions> = async ({ ctx, next, path, type, input, rawInput, meta }) => {
//   ctx.packageOptions = {
//     packages: ['threads'],
//     options: { go_package: '/example' },
//   };
//   return next({
//     ctx,
//   });
// };
//# sourceMappingURL=packageMiddleware.js.map