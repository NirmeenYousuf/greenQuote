import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import { fetchSchema } from './ValidationSchemas';
import { UserType } from '../Users/Types';
import { selectQuotesForList } from './Model';

const options: RouteOptions = {
  validate: fetchSchema,
  description: 'Fetch quotes for the authenticated user',
  notes:
    'Fetches quotes for the authenticated user. Admin users can fetch quotes for all users, while regular users can only fetch their own quotes.',
  tags: ['api', 'quotes'],
  async handler(req: Request, h: ResponseToolkit) {
    const { id: userId, userType } = req.auth.credentials as {
      id: number;
      userType: string;
    };

    const { name, email, pageSize, pageNumber } = req.query;

    if (userType === UserType.admin) {
      const quotes = await selectQuotesForList({
        name,
        email,
        pageSize,
        pageNumber,
      });
      return h.response(quotes).code(200);
    } else {
      const quotes = await selectQuotesForList({
        userId,
        pageSize,
        pageNumber,
      });
      return h.response(quotes).code(200);
    }
  },
};

export default options;
