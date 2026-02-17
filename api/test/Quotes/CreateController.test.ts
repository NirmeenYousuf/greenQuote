import { Server, ServerInjectOptions } from '@hapi/hapi';
import { getServer } from '../server';
import { buildUser } from '../fixtures';
import { deleteData, insert } from '../db';
import { User, UserType } from '../../src/components/Users/Types';

describe('POST /quotes', () => {
  let server: Server;
  let user: User;

  beforeAll(async () => {
    server = await getServer();
    const result = await insert('Users', buildUser());
    user = result[0] as User;
  });

  afterAll(async () => {
    await deleteData('Quotes', { userId: user.id });
    await deleteData('Users', { id: user.id });
    await server.stop();
  });

  function getInjectOptions(): ServerInjectOptions {
    return {
      method: 'post',
      url: `/quotes`,
      auth: {
        strategy: 'session',
        credentials: {
          id: user.id,
          userType: user.userType,
          scope: [user.userType],
        },
      },
    };
  }

  function getPayload() {
    return {
      address: 'test address',
      monthlyConsumptionKwh: 100,
      systemSizeKw: 100,
      downPayment: 10,
    };
  }

  it('should return 400 if address is missing from payload', async () => {
    const payload = getPayload() as any;
    delete payload.address;

    const options = getInjectOptions();
    options.payload = payload;
    const res = await server.inject(options);

    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 if monthlyConsumptionKwh is missing from payload', async () => {
    const payload = getPayload() as any;
    delete payload.monthlyConsumptionKwh;

    const options = getInjectOptions();
    options.payload = payload;
    const res = await server.inject(options);

    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 if systemSizeKw is missing from payload', async () => {
    const payload = getPayload() as any;
    delete payload.systemSizeKw;

    const options = getInjectOptions();
    options.payload = payload;
    const res = await server.inject(options);

    expect(res.statusCode).toEqual(400);
  });

  it('should return 403 if user type is admin', async () => {
    const payload = getPayload();
    const options: ServerInjectOptions = {
      method: 'post',
      url: `/quotes`,
      auth: {
        strategy: 'session',
        credentials: {
          id: 1,
          userType: UserType.admin,
          scope: [UserType.admin],
        },
      },
    };

    options.payload = payload;
    const res = await server.inject(options);
    expect(res.statusCode).toEqual(403);
  });

  it('should return 401 if user is not logged in', async () => {
    const payload = getPayload();
    const options: ServerInjectOptions = {
      method: 'post',
      url: `/quotes`,
    };

    options.payload = payload;
    const res = await server.inject(options);
    expect(res.statusCode).toEqual(401);
  });

  it('should return 201 if all required fields are present and user is authorized', async () => {
    const payload = getPayload();
    const options = getInjectOptions();

    options.payload = payload;
    const res = await server.inject(options);
    const result = res.result as any;
    expect(res.statusCode).toEqual(201);
    expect(result.quote).toBeDefined();
    expect(result.quote.userId).toBe(user.id);
  });
});
