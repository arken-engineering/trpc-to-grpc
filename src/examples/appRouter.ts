import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { t, packageMiddleware, loggingMiddleware } from '../middleware/packageMiddleware';
import { generateProtoFile } from '../generateProto';

const Msg1Schema = z.object({});

const StringValue = z.string();
const UInt64Value = z.number();

export const ThreadModelSchema = z.object({
  id: StringValue,
  name: StringValue,
  description: StringValue,
  content: StringValue,
  created_at: StringValue,
  updated_at: StringValue,
  owner: StringValue,
  images: z.array(StringValue),
});

export const PaginationSchema = z.object({
  page: UInt64Value,
  limit: UInt64Value,
});

export const IdRequestSchema = z.object({
  id: StringValue,
});

export const CreateRequestSchema = z.object({
  name: StringValue,
  description: StringValue,
  content: StringValue,
  owner: StringValue,
});

export const appRouter = t.router({
  create: t.procedure
    .use(packageMiddleware({ packageName: 'threads', options: { go_package: '/example' } }))
    .input(CreateRequestSchema)
    .output(ThreadModelSchema)
    .mutation(({ input }) => {
      return {
        ...input,
        id: 'new-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [],
      };
    }),
  getMany: t.procedure
    .use(packageMiddleware({ packageName: 'threads', options: { go_package: '/example' } }))
    .input(PaginationSchema)
    .output(z.array(ThreadModelSchema))
    .query(({ input }) => {
      return [
        {
          id: '1',
          name: 'Thread 1',
          description: 'Description 1',
          content: 'Content 1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          owner: 'owner1',
          images: [],
        },
      ];
    }),
  getOne: t.procedure
    .use(packageMiddleware({ packageName: 'threads', options: { go_package: '/example' } }))
    .input(IdRequestSchema)
    .output(ThreadModelSchema)
    .query(({ input }) => {
      return {
        id: input.id,
        name: 'Thread 1',
        description: 'Description 1',
        content: 'Content 1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        owner: 'owner1',
        images: [],
      };
    }),
  makeHat: t.procedure
    .use(
      packageMiddleware({
        packageName: 'twitch.twirp.example',
        options: { go_package: '/example' },
      })
    )
    .input(z.object({ inches: z.number() }))
    .output(
      z.object({
        size: z.number(),
        color: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ input }) => {
      return {
        size: input.inches,
        color: 'red', // For simplicity, using a fixed color
        name: 'bowler',
      };
    }),
  send: t.procedure
    .use(
      packageMiddleware({
        packageName: 'test.multiple',
        options: { go_package: '/multiple' },
      })
    )
    .input(Msg1Schema)
    .output(Msg1Schema)
    .mutation(() => {
      return {};
    }),
  execute: t.procedure
    .use(
      packageMiddleware({
        packageName: 'network.protocol.storage',
        options: { cc_generic_services: 'true' },
      })
    )
    .input(
      z.object({
        schema: z.string().optional(),
        privilege: z
          .object({
            bits: z.number().optional(),
            program: z.number().optional(),
          })
          .optional(),
        read_only: z.boolean().optional(),
        wants_row_key: z.boolean().optional(),
        wants_column_name: z.boolean().optional(),
        max_data_size: z.number().optional(),
        operations: z.array(
          z.object({
            table_id: z.object({ hash: z.instanceof(Uint8Array) }),
            column_id: z.object({ hash: z.instanceof(Uint8Array) }).optional(),
            row_id: z.object({ hash: z.instanceof(Uint8Array) }).optional(),
            row_key: z.instanceof(Uint8Array).optional(),
            version: z.number().optional(),
            rops: z.array(
              z.object({
                op: z.enum([
                  'ROW_DELETE',
                  'ROW_FETCH',
                  'COL_DELETE',
                  'COL_FETCH',
                  'COL_WRITE',
                  'COL_MERGE',
                  'FLD_CLEAR',
                  'FLD_FETCH',
                  'FLD_WRITE',
                  'FLD_MERGE',
                  'FLD_INCR',
                  'FLD_TEST',
                  'FLD_SCAN',
                  'ROW_TEST',
                  'COL_TEST',
                  'FLD_SMAX',
                  'COL_COND',
                  'FLD_COND',
                  'COND_POP',
                  'LOG_DEBUG',
                ]),
                data: z.instanceof(Uint8Array).optional(),
                fields: z.array(z.object({})).optional(),
                min_version: z.number().optional(),
                max_version: z.number().optional(),
                scan: z.object({}).optional(),
                limit: z.number().optional(),
                condition: z
                  .enum([
                    'COND_ALWAYS',
                    'COND_NOT_EXISTS',
                    'COND_NOT_EQUAL',
                    'COND_LESS_THAN',
                    'COND_NOT_GREATER',
                    'COND_EQUALS',
                    'COND_NOT_LESS',
                    'COND_GREATER_THAN',
                    'COND_NEVER',
                  ])
                  .optional(),
                message: z.string().optional(),
              })
            ),
            mutate_version: z.number().optional(),
            privilege: z
              .object({
                bits: z.number().optional(),
                program: z.number().optional(),
              })
              .optional(),
          })
        ),
        timeout: z.number().optional(),
        agent_id: z.object({}).optional(),
        query_name: z.string().optional(),
        process_name: z.string().optional(),
      })
    )
    .output(
      z.object({
        error_code: z.number().optional(),
        results: z.array(
          z.object({
            error_code: z.number().optional(),
            table_id: z.object({ hash: z.instanceof(Uint8Array) }),
            data: z.array(
              z.object({
                column_id: z.object({ hash: z.instanceof(Uint8Array) }),
                row_id: z.object({ hash: z.instanceof(Uint8Array) }),
                row_key: z.instanceof(Uint8Array).optional(),
                version: z.number().optional(),
                data: z.instanceof(Uint8Array).optional(),
              })
            ),
          })
        ),
        error_message: z.string().optional(),
      })
    )
    .mutation(() => {
      return {
        error_code: 0,
        results: [],
        error_message: '',
      };
    }),
  openTable: t.procedure
    .use(
      packageMiddleware({
        packageName: 'network.protocol.storage',
        options: { cc_generic_services: 'true' },
      })
    )
    .input(
      z.object({
        schema: z.literal('DEFAULT'),
        privilege: z
          .object({
            bits: z.number(),
            program: z.number(),
          })
          .optional(),
        table_id: z.object({ hash: z.instanceof(Uint8Array) }),
        agent_id: z.object({}).optional(),
        process_name: z.string().optional(),
      })
    )
    .output(z.object({}))
    .mutation(() => {
      return {};
    }),
  openColumn: t.procedure
    .use(
      packageMiddleware({
        packageName: 'network.protocol.storage',
        options: { cc_generic_services: 'true' },
      })
    )
    .input(
      z.object({
        schema: z.literal('DEFAULT'),
        privilege: z
          .object({
            bits: z.number(),
            program: z.number(),
          })
          .optional(),
        table_id: z.object({ hash: z.instanceof(Uint8Array) }),
        column_id: z.object({ hash: z.instanceof(Uint8Array) }),
        proto_type: z.string().optional(),
        agent_id: z.object({}).optional(),
        process_name: z.string().optional(),
      })
    )
    .output(
      z.object({
        server_field_ops: z.boolean().optional(),
      })
    )
    .mutation(() => {
      return {
        server_field_ops: false,
      };
    }),
});

export type AppRouter = typeof appRouter;

generateProtoFile(appRouter, './proto/appRouter.proto');
