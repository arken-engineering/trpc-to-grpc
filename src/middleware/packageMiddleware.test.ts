import { packageMiddleware } from './packageMiddleware'; // Adjust the path as needed
import { initTRPC } from '@trpc/server';
import { jest } from '@jest/globals';

const t = initTRPC.context<{
  packageOptions?: {
    packages: string[];
    options: {
      go_package: string;
    };
  };
}>().create();

describe('packageMiddleware', () => {
  it('should add package options to context', async () => {
    const ctx: any = {};

    await packageMiddleware({
      ctx,
      next: () => {

    expect(ctx.packageOptions).toEqual({
        packages: ['threads'],
        options: { go_package: '/example' },
      });
      }
    });

  });
});