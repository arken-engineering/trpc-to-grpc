"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.CreateRequestSchema = exports.IdRequestSchema = exports.PaginationSchema = exports.ThreadModelSchema = void 0;
const zod_1 = require("zod");
const packageMiddleware_1 = require("../middleware/packageMiddleware"); // Adjust the path as necessary
const Msg1Schema = zod_1.z.object({});
const StringValue = zod_1.z.string();
const UInt64Value = zod_1.z.number();
exports.ThreadModelSchema = zod_1.z.object({
    id: StringValue,
    name: StringValue,
    description: StringValue,
    content: StringValue,
    created_at: StringValue,
    updated_at: StringValue,
    owner: StringValue,
    images: zod_1.z.array(StringValue),
});
exports.PaginationSchema = zod_1.z.object({
    page: UInt64Value,
    limit: UInt64Value,
});
exports.IdRequestSchema = zod_1.z.object({
    id: StringValue,
});
exports.CreateRequestSchema = zod_1.z.object({
    name: StringValue,
    description: StringValue,
    content: StringValue,
    owner: StringValue,
});
exports.appRouter = packageMiddleware_1.t.router({
    create: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({ packages: ['threads'], options: { go_package: '/example' } }))
        .input(exports.CreateRequestSchema)
        .output(exports.ThreadModelSchema)
        .mutation(({ input }) => {
        return {
            ...input,
            id: 'new-id',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: [],
        };
    }),
    getMany: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({ packages: ['threads'], options: { go_package: '/example' } }))
        .input(exports.PaginationSchema)
        .output(zod_1.z.array(exports.ThreadModelSchema))
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
    getOne: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({ packages: ['threads'], options: { go_package: '/example' } }))
        .input(exports.IdRequestSchema)
        .output(exports.ThreadModelSchema)
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
    makeHat: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({ packages: ['twitch.twirp.example'], options: { go_package: '/example' } }))
        .input(zod_1.z.object({ inches: zod_1.z.number() }))
        .output(zod_1.z.object({
        size: zod_1.z.number(),
        color: zod_1.z.string(),
        name: zod_1.z.string(),
    }))
        .mutation(({ input }) => {
        return {
            size: input.inches,
            color: 'red',
            name: 'bowler',
        };
    }),
    send: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({
        packages: ['twirp.internal.twirp', 'test.multiple'],
        options: { go_package: '/multiple' },
    }))
        .input(Msg1Schema)
        .output(Msg1Schema)
        .mutation(() => {
        return {};
    }),
    execute: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({
        packages: ['network.protocol.storage'],
        options: { cc_generic_services: 'true' },
    }))
        .input(zod_1.z.object({
        schema: zod_1.z.string().optional(),
        privilege: zod_1.z
            .object({
            bits: zod_1.z.number().optional(),
            program: zod_1.z.number().optional(),
        })
            .optional(),
        read_only: zod_1.z.boolean().optional(),
        wants_row_key: zod_1.z.boolean().optional(),
        wants_column_name: zod_1.z.boolean().optional(),
        max_data_size: zod_1.z.number().optional(),
        operations: zod_1.z.array(zod_1.z.object({
            table_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }),
            column_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }).optional(),
            row_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }).optional(),
            row_key: zod_1.z.instanceof(Uint8Array).optional(),
            version: zod_1.z.number().optional(),
            rops: zod_1.z.array(zod_1.z.object({
                op: zod_1.z.enum([
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
                data: zod_1.z.instanceof(Uint8Array).optional(),
                fields: zod_1.z.array(zod_1.z.object({})).optional(),
                min_version: zod_1.z.number().optional(),
                max_version: zod_1.z.number().optional(),
                scan: zod_1.z.object({}).optional(),
                limit: zod_1.z.number().optional(),
                condition: zod_1.z
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
                message: zod_1.z.string().optional(),
            })),
            mutate_version: zod_1.z.number().optional(),
            privilege: zod_1.z
                .object({
                bits: zod_1.z.number().optional(),
                program: zod_1.z.number().optional(),
            })
                .optional(),
        })),
        timeout: zod_1.z.number().optional(),
        agent_id: zod_1.z.object({}).optional(),
        query_name: zod_1.z.string().optional(),
        process_name: zod_1.z.string().optional(),
    }))
        .output(zod_1.z.object({
        error_code: zod_1.z.number().optional(),
        results: zod_1.z.array(zod_1.z.object({
            error_code: zod_1.z.number().optional(),
            table_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }),
            data: zod_1.z.array(zod_1.z.object({
                column_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }),
                row_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }),
                row_key: zod_1.z.instanceof(Uint8Array).optional(),
                version: zod_1.z.number().optional(),
                data: zod_1.z.instanceof(Uint8Array).optional(),
            })),
        })),
        error_message: zod_1.z.string().optional(),
    }))
        .mutation(() => {
        return {
            error_code: 0,
            results: [],
            error_message: '',
        };
    }),
    openTable: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({
        packages: ['network.protocol.storage'],
        options: { cc_generic_services: 'true' },
    }))
        .input(zod_1.z.object({
        schema: zod_1.z.literal('DEFAULT'),
        privilege: zod_1.z
            .object({
            bits: zod_1.z.number(),
            program: zod_1.z.number(),
        })
            .optional(),
        table_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }),
        agent_id: zod_1.z.object({}).optional(),
        process_name: zod_1.z.string().optional(),
    }))
        .output(zod_1.z.object({}))
        .mutation(() => {
        return {};
    }),
    openColumn: packageMiddleware_1.t.procedure
        .use((0, packageMiddleware_1.packageMiddleware)({
        packages: ['network.protocol.storage'],
        options: { cc_generic_services: 'true' },
    }))
        .input(zod_1.z.object({
        schema: zod_1.z.literal('DEFAULT'),
        privilege: zod_1.z
            .object({
            bits: zod_1.z.number(),
            program: zod_1.z.number(),
        })
            .optional(),
        table_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }),
        column_id: zod_1.z.object({ hash: zod_1.z.instanceof(Uint8Array) }),
        proto_type: zod_1.z.string().optional(),
        agent_id: zod_1.z.object({}).optional(),
        process_name: zod_1.z.string().optional(),
    }))
        .output(zod_1.z.object({
        server_field_ops: zod_1.z.boolean().optional(),
    }))
        .mutation(() => {
        return {
            server_field_ops: false,
        };
    }),
});
//# sourceMappingURL=appRouter.js.map