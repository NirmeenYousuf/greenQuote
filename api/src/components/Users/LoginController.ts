import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import { loginSchema } from './ValidationSchemas';
import { selectUser } from './Model';
import { User } from './Types';

const options: RouteOptions = {
  validate: loginSchema,
  auth: false,
  description: 'Login a user',
  notes:
    'Logs in a user and sets a session cookie. Returns user information on successful login.',
  tags: ['api', 'users'],
  async handler(req: Request, h: ResponseToolkit) {
    const { email, password } = req.payload as {
      email: string;
      password: string;
    };

    const user: User = await selectUser({ email, password });

    if (!user) {
      return h.response({ message: 'Invalid email or password' }).code(401);
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    };
    req.cookieAuth.set({
      ...userData,
    });

    return h.response({ ...userData }).code(200);
  },
};

export default options;
