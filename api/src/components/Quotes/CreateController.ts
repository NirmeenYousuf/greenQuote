import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import { createSchema } from './ValidationSchemas';
import { createQuote } from './helpers';
import { QuoteInput } from './Types';

const options: RouteOptions = {
  validate: createSchema,
  auth: {
    strategy: 'session',
    scope: ['user'],
  },
  description: 'Create a new quote',
  notes: 'Creates a new quote for the authenticated user',
  tags: ['api', 'quotes'],
  async handler(req: Request, h: ResponseToolkit) {
    const { id } = req.auth.credentials;
    const quoteInput: QuoteInput = req.payload as QuoteInput;

    const quote = await createQuote({
      userId: id as number,
      quoteInput,
    });

    return h.response({ quote }).code(201);
  },
};

export default options;
