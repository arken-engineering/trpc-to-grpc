import { appRouter, AppRouter } from './basic';
import { inferRouterInputs, inferRouterOutputs, inferAsyncReturnType } from '@trpc/server';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { customTransformer } from '../transformer';
import http from 'http';

const createContext = async () => ({});

type Context = inferAsyncReturnType<typeof createContext>;
type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

describe('tRPC Procedures', () => {
  let server: http.Server;
  let client: ReturnType<typeof createTRPCProxyClient<AppRouter>>;

  beforeAll(async () => {
    const trpcServer = createHTTPServer({
      router: appRouter,
      createContext,
      transformer: customTransformer,
    });

    server = http.createServer(trpcServer).listen(3030);

    const url = `http://localhost:${(server.address() as any).port}`;
    client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url,
        }),
      ],
      transformer: customTransformer,
    });
  });

  afterAll((done) => {
    server.close(done);
  });

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
});