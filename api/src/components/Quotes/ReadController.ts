import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import { readSchema } from './ValidationSchemas';
import { selectQuoteById } from './Model';
import { UserType } from '../Users/Types';

const options: RouteOptions = {
  validate: readSchema,
  description: 'Get a quote by ID',
  notes:
    'Retrieves a quote by its ID. Admin users can access any quote, while regular users can only access their own quotes.',
  tags: ['api', 'quotes'],
  async handler(req: Request, h: ResponseToolkit) {
    const { id: userId, userType } = req.auth.credentials;
    const { id } = req.params;

    const quote = await selectQuoteById({ id });

    if (!quote) {
      return h.response({ message: 'Quote not found' }).code(404);
    } else if (userType === UserType.user && quote.userId !== userId) {
      return h.response({ message: 'Unauthorized access to quote' }).code(403);
    }

    return h.response({ ...quote }).code(200);
  },
};

export default options;
