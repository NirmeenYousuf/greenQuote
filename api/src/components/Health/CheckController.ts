import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

const options: RouteOptions = {
  auth: false,
  description: 'Get health status of the API',
  notes: 'Returns the health status, uptime, and current timestamp of the API',
  tags: ['api'],
  async handler(req: Request, h: ResponseToolkit) {
    return h
      .response({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      })
      .code(200);
  },
};

export default options;
