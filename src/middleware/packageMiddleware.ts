import { initTRPC } from '@trpc/server';
import { customTransformer } from '../transformer';

export const t = initTRPC
  .context<{
    packageOptions?: {
      packageName: string;
      options: {
        go_package: string;
      };
    };
  }>()
  .create({
    transformer: customTransformer,
  });

export const packageMiddleware = (input: any) => {
  return t.middleware(async function packageMiddleware({ ctx, next }: any) {
    const packageOptions = {
      packageName: input.packageName,
      options: input.options,
    };

    ctx.packageOptions = packageOptions;

    return next({
      ctx,
    });
  });
};

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
