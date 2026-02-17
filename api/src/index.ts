import Hapi from '@hapi/hapi';
import routes from './routes';
import dotenv from 'dotenv';
import Cookie from '@hapi/cookie';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

import Joi from 'joi';

export async function startServer() {
  dotenv.config();
  const server = Hapi.server({
    port: 3001,
    host: 'localhost',
  });

  const swaggerOptions = {
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
    },
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  await server.register(Cookie);

  // Define cookie auth strategy
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'app-cookie',
      password: process.env.COOKIE_SECRET, // must be 32+ chars
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
  //validation
  server.validator(Joi);
  // Add routes
  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

void startServer();
