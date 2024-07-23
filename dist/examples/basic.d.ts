import { z } from 'zod';
export declare const ThreadModelSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    content: z.ZodString;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    owner: z.ZodString;
    images: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    description: string;
    content: string;
    created_at: string;
    updated_at: string;
    owner: string;
    images: string[];
}, {
    name: string;
    id: string;
    description: string;
    content: string;
    created_at: string;
    updated_at: string;
    owner: string;
    images: string[];
}>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page: number;
    limit: number;
}>;
export declare const IdRequestSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const CreateRequestSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    content: z.ZodString;
    owner: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    content: string;
    owner: string;
}, {
    name: string;
    description: string;
    content: string;
    owner: string;
}>;
export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        packageOptions?: {
            packages: string[];
            options: {
                go_package: string;
            };
        } | undefined;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DataTransformer;
}>, {
    create: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {
            name: string;
            description: string;
            content: string;
            owner: string;
        };
        _input_out: {
            name: string;
            description: string;
            content: string;
            owner: string;
        };
        _output_in: {
            name: string;
            id: string;
            description: string;
            content: string;
            created_at: string;
            updated_at: string;
            owner: string;
            images: string[];
        };
        _output_out: {
            name: string;
            id: string;
            description: string;
            content: string;
            created_at: string;
            updated_at: string;
            owner: string;
            images: string[];
        };
    }, unknown>;
    getMany: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {
            page: number;
            limit: number;
        };
        _input_out: {
            page: number;
            limit: number;
        };
        _output_in: {
            name: string;
            id: string;
            description: string;
            content: string;
            created_at: string;
            updated_at: string;
            owner: string;
            images: string[];
        }[];
        _output_out: {
            name: string;
            id: string;
            description: string;
            content: string;
            created_at: string;
            updated_at: string;
            owner: string;
            images: string[];
        }[];
    }, unknown>;
    getOne: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {
            id: string;
        };
        _input_out: {
            id: string;
        };
        _output_in: {
            name: string;
            id: string;
            description: string;
            content: string;
            created_at: string;
            updated_at: string;
            owner: string;
            images: string[];
        };
        _output_out: {
            name: string;
            id: string;
            description: string;
            content: string;
            created_at: string;
            updated_at: string;
            owner: string;
            images: string[];
        };
    }, unknown>;
    makeHat: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {
            inches: number;
        };
        _input_out: {
            inches: number;
        };
        _output_in: {
            name: string;
            size: number;
            color: string;
        };
        _output_out: {
            name: string;
            size: number;
            color: string;
        };
    }, unknown>;
    send: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {};
        _input_out: {};
        _output_in: {};
        _output_out: {};
    }, {}>;
    execute: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {
            operations: {
                table_id: {
                    hash: Uint8Array;
                };
                rops: {
                    op: "ROW_DELETE" | "ROW_FETCH" | "COL_DELETE" | "COL_FETCH" | "COL_WRITE" | "COL_MERGE" | "FLD_CLEAR" | "FLD_FETCH" | "FLD_WRITE" | "FLD_MERGE" | "FLD_INCR" | "FLD_TEST" | "FLD_SCAN" | "ROW_TEST" | "COL_TEST" | "FLD_SMAX" | "COL_COND" | "FLD_COND" | "COND_POP" | "LOG_DEBUG";
                    message?: string | undefined;
                    limit?: number | undefined;
                    data?: Uint8Array | undefined;
                    fields?: {}[] | undefined;
                    min_version?: number | undefined;
                    max_version?: number | undefined;
                    scan?: {} | undefined;
                    condition?: "COND_ALWAYS" | "COND_NOT_EXISTS" | "COND_NOT_EQUAL" | "COND_LESS_THAN" | "COND_NOT_GREATER" | "COND_EQUALS" | "COND_NOT_LESS" | "COND_GREATER_THAN" | "COND_NEVER" | undefined;
                }[];
                privilege?: {
                    bits?: number | undefined;
                    program?: number | undefined;
                } | undefined;
                column_id?: {
                    hash: Uint8Array;
                } | undefined;
                row_id?: {
                    hash: Uint8Array;
                } | undefined;
                row_key?: Uint8Array | undefined;
                version?: number | undefined;
                mutate_version?: number | undefined;
            }[];
            schema?: string | undefined;
            privilege?: {
                bits?: number | undefined;
                program?: number | undefined;
            } | undefined;
            read_only?: boolean | undefined;
            wants_row_key?: boolean | undefined;
            wants_column_name?: boolean | undefined;
            max_data_size?: number | undefined;
            timeout?: number | undefined;
            agent_id?: {} | undefined;
            query_name?: string | undefined;
            process_name?: string | undefined;
        };
        _input_out: {
            operations: {
                table_id: {
                    hash: Uint8Array;
                };
                rops: {
                    op: "ROW_DELETE" | "ROW_FETCH" | "COL_DELETE" | "COL_FETCH" | "COL_WRITE" | "COL_MERGE" | "FLD_CLEAR" | "FLD_FETCH" | "FLD_WRITE" | "FLD_MERGE" | "FLD_INCR" | "FLD_TEST" | "FLD_SCAN" | "ROW_TEST" | "COL_TEST" | "FLD_SMAX" | "COL_COND" | "FLD_COND" | "COND_POP" | "LOG_DEBUG";
                    message?: string | undefined;
                    limit?: number | undefined;
                    data?: Uint8Array | undefined;
                    fields?: {}[] | undefined;
                    min_version?: number | undefined;
                    max_version?: number | undefined;
                    scan?: {} | undefined;
                    condition?: "COND_ALWAYS" | "COND_NOT_EXISTS" | "COND_NOT_EQUAL" | "COND_LESS_THAN" | "COND_NOT_GREATER" | "COND_EQUALS" | "COND_NOT_LESS" | "COND_GREATER_THAN" | "COND_NEVER" | undefined;
                }[];
                privilege?: {
                    bits?: number | undefined;
                    program?: number | undefined;
                } | undefined;
                column_id?: {
                    hash: Uint8Array;
                } | undefined;
                row_id?: {
                    hash: Uint8Array;
                } | undefined;
                row_key?: Uint8Array | undefined;
                version?: number | undefined;
                mutate_version?: number | undefined;
            }[];
            schema?: string | undefined;
            privilege?: {
                bits?: number | undefined;
                program?: number | undefined;
            } | undefined;
            read_only?: boolean | undefined;
            wants_row_key?: boolean | undefined;
            wants_column_name?: boolean | undefined;
            max_data_size?: number | undefined;
            timeout?: number | undefined;
            agent_id?: {} | undefined;
            query_name?: string | undefined;
            process_name?: string | undefined;
        };
        _output_in: {
            results: {
                table_id: {
                    hash: Uint8Array;
                };
                data: {
                    column_id: {
                        hash: Uint8Array;
                    };
                    row_id: {
                        hash: Uint8Array;
                    };
                    row_key?: Uint8Array | undefined;
                    version?: number | undefined;
                    data?: Uint8Array | undefined;
                }[];
                error_code?: number | undefined;
            }[];
            error_code?: number | undefined;
            error_message?: string | undefined;
        };
        _output_out: {
            results: {
                table_id: {
                    hash: Uint8Array;
                };
                data: {
                    column_id: {
                        hash: Uint8Array;
                    };
                    row_id: {
                        hash: Uint8Array;
                    };
                    row_key?: Uint8Array | undefined;
                    version?: number | undefined;
                    data?: Uint8Array | undefined;
                }[];
                error_code?: number | undefined;
            }[];
            error_code?: number | undefined;
            error_message?: string | undefined;
        };
    }, unknown>;
    openTable: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {
            schema: "DEFAULT";
            table_id: {
                hash: Uint8Array;
            };
            privilege?: {
                bits: number;
                program: number;
            } | undefined;
            agent_id?: {} | undefined;
            process_name?: string | undefined;
        };
        _input_out: {
            schema: "DEFAULT";
            table_id: {
                hash: Uint8Array;
            };
            privilege?: {
                bits: number;
                program: number;
            } | undefined;
            agent_id?: {} | undefined;
            process_name?: string | undefined;
        };
        _output_in: {};
        _output_out: {};
    }, {}>;
    openColumn: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                packageOptions?: {
                    packages: string[];
                    options: {
                        go_package: string;
                    };
                } | undefined;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            packageOptions: {
                packages: string[];
                options: {
                    go_package: string;
                };
            } | undefined;
        };
        _input_in: {
            schema: "DEFAULT";
            table_id: {
                hash: Uint8Array;
            };
            column_id: {
                hash: Uint8Array;
            };
            privilege?: {
                bits: number;
                program: number;
            } | undefined;
            agent_id?: {} | undefined;
            process_name?: string | undefined;
            proto_type?: string | undefined;
        };
        _input_out: {
            schema: "DEFAULT";
            table_id: {
                hash: Uint8Array;
            };
            column_id: {
                hash: Uint8Array;
            };
            privilege?: {
                bits: number;
                program: number;
            } | undefined;
            agent_id?: {} | undefined;
            process_name?: string | undefined;
            proto_type?: string | undefined;
        };
        _output_in: {
            server_field_ops?: boolean | undefined;
        };
        _output_out: {
            server_field_ops?: boolean | undefined;
        };
    }, unknown>;
}>;
export type AppRouter = typeof appRouter;
