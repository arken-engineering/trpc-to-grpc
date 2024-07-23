import { initTRPC } from '@trpc/server';
import { customTransformer } from '../transformer';

export const t = initTRPC
  .context<{
    packageOptions?: {
      packages: string[];
      options: {
        go_package: string;
      };
    };
  }>()
  .create({
    transformer: customTransformer,
  });

export const packageMiddleware = (input: any) =>
  t.middleware(async ({ ctx, next }: any) => {
    const packageOptions = {
      packages: input.packages,
      options: input.options,
    };

    ctx.packageOptions = packageOptions;

    return next({
      ctx,
    });
  });

// Example: Logging middleware
export const loggingMiddleware = () =>
  t.middleware(async ({ ctx, path, type, next }) => {
    console.log(`Request: ${type} ${path}`, ctx.packageOptions);
    const result = await next();
    console.log(`Response: ${type} ${path}`);
    return result;
  });

export const publicProcedure = t.procedure;
export const router = t.router;

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
