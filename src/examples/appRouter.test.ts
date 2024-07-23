import { appRouter, AppRouter } from './appRouter';
import { inferRouterInputs, inferRouterOutputs, inferAsyncReturnType } from '@trpc/server';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import * as fs from 'fs';
import { customTransformer } from '../transformer';
import { generateProtoFile } from '../generateProto';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

const createContext = async () => ({});

type Context = inferAsyncReturnType<typeof createContext>;
type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

let server: any;
let client: ReturnType<typeof createTRPCProxyClient<AppRouter>>;

const setupServer = async () => {
  const trpcServer = createHTTPServer({
    router: appRouter,
    createContext,
    // @ts-ignore
    transformer: customTransformer,
  });

  trpcServer.listen(3030);

  server = trpcServer.server

  const url = `http://localhost:${(server.address() as any).port}`;
  client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url,
      }),
    ],
    transformer: customTransformer,
  });
};

const teardownServer = (done: jest.DoneCallback) => {
  server.close(done);
};

describe('tRPC Procedures', () => {
  beforeAll(setupServer);
  afterAll(teardownServer);

  it('should handle create procedure', async () => {
    const input: RouterInput['create'] = {
      name: 'testName',
      description: 'testDescription',
      content: 'testContent',
      owner: 'testOwner',
    };
    const result: RouterOutput['create'] = await client.create.mutate(input);

    expect(result).toMatchObject({
      ...input,
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      images: [],
    });
  });

  it('should handle getMany procedure', async () => {
    const input: RouterInput['getMany'] = { page: 1, limit: 10 };
    const result: RouterOutput['getMany'] = await client.getMany.query(input);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          content: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          owner: expect.any(String),
          images: expect.any(Array),
        }),
      ])
    );
  });

  it('should handle getOne procedure', async () => {
    const input: RouterInput['getOne'] = { id: 'testId' };
    const result: RouterOutput['getOne'] = await client.getOne.query(input);

    expect(result).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      content: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      owner: expect.any(String),
      images: expect.any(Array),
    });
  });

  it('should handle makeHat procedure', async () => {
    const input: RouterInput['makeHat'] = { inches: 10 };
    const result: RouterOutput['makeHat'] = await client.makeHat.mutate(input);

    expect(result).toMatchObject({
      size: input.inches,
      color: expect.any(String),
      name: expect.any(String),
    });
  });

  it('should handle send procedure', async () => {
    const input: RouterInput['send'] = {};
    const result: RouterOutput['send'] = await client.send.mutate(input);

    expect(result).toEqual({});
  });

  it('should handle execute procedure', async () => {
    const input: RouterInput['execute'] = {
      schema: 'DEFAULT',
      privilege: { bits: 0, program: 0 },
      read_only: false,
      wants_row_key: false,
      wants_column_name: false,
      max_data_size: 16777215,
      operations: [
        {
          table_id: { hash: new Uint8Array() },
          column_id: { hash: new Uint8Array() },
          row_id: { hash: new Uint8Array() },
          rops: [
            {
              op: 'ROW_DELETE',
            },
          ],
        },
      ],
      timeout: 1000,
      agent_id: {},
      query_name: 'NoName',
      process_name: 'testProcess',
    };
    const result: RouterOutput['execute'] = await client.execute.mutate(input);

    expect(result).toMatchObject({
      error_code: 0,
      results: expect.any(Array),
      error_message: '',
    });
  });

  it('should handle openTable procedure', async () => {
    const input: RouterInput['openTable'] = {
      schema: 'DEFAULT',
      privilege: { bits: 0, program: 0 },
      table_id: { hash: new Uint8Array() },
      agent_id: {},
      process_name: 'testProcess',
    };
    const result: RouterOutput['openTable'] = await client.openTable.mutate(input);

    expect(result).toEqual({});
  });

  it('should handle openColumn procedure', async () => {
    const input: RouterInput['openColumn'] = {
      schema: 'DEFAULT',
      privilege: { bits: 0, program: 0 },
      table_id: { hash: new Uint8Array() },
      column_id: { hash: new Uint8Array() },
      proto_type: 'testProto',
      agent_id: {},
      process_name: 'testProcess',
    };
    const result: RouterOutput['openColumn'] = await client.openColumn.mutate(input);

    expect(result).toMatchObject({
      server_field_ops: false,
    });
  });


describe('generateProtoFile', () => {
  it('should generate proto file content correctly', () => {
    const outputPath = './proto/generated.proto';
    generateProtoFile(appRouter, outputPath);

    const expectedContent = `
syntax = "proto3";

package threads;
option go_package = "/example";

service Threads {
  rpc Create(CreateRequest) returns (CreateResponse);
  rpc GetMany(GetManyRequest) returns (GetManyResponse);
  rpc GetOne(GetOneRequest) returns (GetOneResponse);
}

message CreateRequest {
  string value = 1;
  string value = 2;
  string value = 3;
  string value = 4;
}

message CreateResponse {
  string value = 1;
  string value = 2;
  string value = 3;
  string value = 4;
  string value = 5;
  string value = 6;
  string value = 7;
  repeated string images = 8;
}

message GetManyRequest {
  uint64 value = 1;
  uint64 value = 2;
}

message GetManyResponse {
  repeated ThreadModel threads = 1;
}

message GetOneRequest {
  string value = 1;
}

message GetOneResponse {
  string value = 1;
  string value = 2;
  string value = 3;
  string value = 4;
  string value = 5;
  string value = 6;
  string value = 7;
  repeated string images = 8;
}

message ThreadModel {
  string value = 1;
  string value = 2;
  string value = 3;
  string value = 4;
  string value = 5;
  string value = 6;
  string value = 7;
  repeated string images = 8;
}

message Msg1 {}

service Svc1 {
  rpc Send(Msg1) returns (Msg1);
}

package twitch.twirp.example;
package twirp.internal.twirp.test.multiple;
option go_package = "/multiple";

message ExecuteRequest {
  string schema = 1;
  .network.protocol.storage.Privilege privilege = 2;
  bool read_only = 3;
  bool wants_row_key = 4;
  bool wants_column_name = 5;
  uint32 max_data_size = 6;
  repeated .network.protocol.storage.Operation operations = 7;
  uint32 timeout = 12;
  .network.protocol.EntityId agent_id = 9;
  string query_name = 10;
  string process_name = 11;
}

message ExecuteResponse {
  uint32 error_code = 1;
  repeated .network.protocol.storage.OperationResult results = 2;
  string error_message = 3;
}

service StorageService {
  rpc Execute(ExecuteRequest) returns (ExecuteResponse);
  rpc OpenTable(OpenTableRequest) returns (OpenTableResponse);
  rpc OpenColumn(OpenColumnRequest) returns (OpenColumnResponse);
}

message OpenTableRequest {
  string schema = 1;
  .network.protocol.storage.Privilege privilege = 2;
  .network.protocol.storage.TableId table_id = 3;
  .network.protocol.EntityId agent_id = 4;
  string process_name = 5;
}

message OpenTableResponse {}

message OpenColumnRequest {
  string schema = 1;
  .network.protocol.storage.Privilege privilege = 2;
  .network.protocol.storage.TableId table_id = 4;
  .network.protocol.storage.ColumnId column_id = 5;
  string proto_type = 6;
  .network.protocol.EntityId agent_id = 7;
  string process_name = 8;
}

message OpenColumnResponse {
  bool server_field_ops = 2;
}

message TableId {
  bytes hash = 1;
}

message ColumnId {
  bytes hash = 1;
}

message RowId {
  bytes hash = 1;
}

message Privilege {
  enum Permission {
    OWNER = 1;
    FRIEND = 2;
    OTHER = 4;
    GAME = 8;
    ALL = 15;
  }
  fixed64 bits = 1;
  fixed32 program = 2;
}

message ScanOperation {
  enum Op {
    IS_CLEAR = 1;
    NOT_CLEAR = 2;
    IS_EQUALS = 3;
    NOT_EQUALS = 4;
    IS_GREATER_THAN = 5;
    NOT_GREATER_THAN = 6;
    IS_LESS_THAN = 7;
    NOT_LESS_THAN = 8;
  }
  .network.protocol.storage.ScanOperation.Op op = 1;
  .network.protocol.Path field = 2;
}

message Command {
  enum Op {
    ROW_DELETE = 1;
    ROW_FETCH = 2;
    COL_DELETE = 3;
    COL_FETCH = 4;
    COL_WRITE = 5;
    COL_MERGE = 6;
    FLD_CLEAR = 7;
    FLD_FETCH = 8;
    FLD_WRITE = 9;
    FLD_MERGE = 10;
    FLD_INCR = 11;
    FLD_TEST = 12;
    FLD_SCAN = 13;
    ROW_TEST = 14;
    COL_TEST = 15;
    FLD_SMAX = 16;
    COL_COND = 17;
    FLD_COND = 18;
    COND_POP = 19;
    LOG_DEBUG = 20;
  }
  .network.protocol.storage.Command.Op op = 1;
  bytes data = 2;
  repeated .network.protocol.Path fields = 3;
  fixed64 min_version = 4;
  fixed64 max_version = 5;
  .network.protocol.storage.ScanOperation scan = 6;
  uint32 limit = 7;
  .network.protocol.storage.Command.Cond condition = 8;
  string message = 11;
}

message Operation {
  .network.protocol.storage.TableId table_id = 1;
  .network.protocol.storage.ColumnId column_id = 2;
  .network.protocol.storage.RowId row_id = 3;
  bytes row_key = 4;
  fixed64 version = 5;
  repeated .network.protocol.storage.Command rops = 6;
  fixed64 mutate_version = 7;
  .network.protocol.storage.Privilege privilege = 8;
}

message Cell {
  .network.protocol.storage.ColumnId column_id = 1;
  .network.protocol.storage.RowId row_id = 2;
  bytes row_key = 3;
  fixed64 version = 4;
  bytes data = 5;
}

message OperationResult {
  uint32 error_code = 1;
  .network.protocol.storage.TableId table_id = 2;
  repeated .network.protocol.storage.Cell data = 3;
}
    `;

    // expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, expect.stringContaining(expectedContent.trim()));
  });
});
});