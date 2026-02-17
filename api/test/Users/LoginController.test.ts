import { Server, ServerInjectOptions } from '@hapi/hapi';
import { getServer } from '../server';
import { buildUser } from '../fixtures';
import { deleteData, insert } from '../db';
import { User } from '../../src/components/Users/Types';

describe('POST /login', () => {
  let server: Server;
  let user: User;

  beforeAll(async () => {
    server = await getServer();
    const result = await insert('Users', buildUser());
    user = result[0] as User;
  });

  afterAll(async () => {
    await deleteData('Users', { id: user.id });
    await server.stop();
  });

  function getInjectOptions(): ServerInjectOptions {
    return {
      method: 'post',
      url: `/login`,
    };
  }

  function getPayload() {
    return {
      email: user.email,
      password: user.password,
    };
  }

  it('should return 400 if email is missing from payload', async () => {
    const payload = getPayload() as any;
    delete payload.email;

    const options = getInjectOptions();
    options.payload = payload;
    const res = await server.inject(options);

    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 if password is missing from payload', async () => {
    const payload = getPayload() as any;
    delete payload.password;

    const options = getInjectOptions();
    options.payload = payload;
    const res = await server.inject(options);

    expect(res.statusCode).toEqual(400);
  });

  it('should return 200 and set cookies if login successfull', async () => {
    const payload = getPayload();
    const options = getInjectOptions();

    options.payload = payload;
    const res = await server.inject(options);
    expect(res.statusCode).toEqual(200);
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
  });
});
