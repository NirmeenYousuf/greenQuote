import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import { registerSchema } from './ValidationSchemas';
import { insertUser, selectUserByEmail } from './Model';
import { knexTransaction } from '../../db';
import { UserType } from './Types';

const options: RouteOptions = {
  validate: registerSchema,
  auth: false,
  description: 'Register a new user',
  notes:
    'Registers a new user with the provided name, email, and password. Returns a success message on successful registration.',
  tags: ['api', 'users'],
  async handler(req: Request, h: ResponseToolkit) {
    const { name, email, password } = req.payload as {
      name: string;
      email: string;
      password: string;
    };

    const userExists = await selectUserByEmail({ email });
    if (userExists) {
      return h
        .response({ message: 'User with provided email already registered' })
        .code(400);
    } else
      await knexTransaction(async (trx) => {
        const payload = {
          name,
          email,
          password,
          userType: UserType.user,
          createdAt: new Date(),
        };

        await insertUser({ payload, trx });
      });

    return h.response({ message: 'User created successfully' }).code(201);
  },
};

export default options;
