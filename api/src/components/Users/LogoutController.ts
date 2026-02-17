import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

const options: RouteOptions = {
  description: 'Logout the authenticated user',
  notes: 'Logs out the authenticated user by clearing the session cookie',
  tags: ['api', 'users'],
  async handler(req: Request, h: ResponseToolkit) {
    req.cookieAuth.clear();
    return h.response({ message: 'User logged out' }).code(200);
  },
};

export default options;
