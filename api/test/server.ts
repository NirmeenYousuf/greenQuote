import Hapi from '@hapi/hapi';
import Joi from 'joi';
import routes from '../src/routes';
import Cookie from '@hapi/cookie';

export async function getServer() {
  const server = Hapi.server({
    port: 3001,
    host: 'localhost',
  });

  await server.register(Cookie);

  // Define cookie auth strategy
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'app-cookie',
      password: 'this_is_a_very_long_super_secret_password_12345', // must be 32+ chars
      isSecure: false, // set true in production (HTTPS)
      ttl: 24 * 60 * 60 * 1000,
    },
    redirectTo: false,
    validate: async (
      request: Request,
      session: { id: number; email: string; userType: string },
    ) => {
      if (!session.id) {
        return { isValid: false };
      }

      return {
        isValid: true,
        credentials: {
          ...session,
          scope: [session.userType],
        },
        artifacts: {},
      };
    },
  });

  server.auth.default({
    strategy: 'session',
  });

  server.validator(Joi);
  // Add routes
  server.route(routes);
  return server;
}
