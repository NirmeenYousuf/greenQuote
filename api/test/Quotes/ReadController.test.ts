import { Server, ServerInjectOptions } from '@hapi/hapi';
import { getServer } from '../server';
import { buildQuote, buildUser } from '../fixtures';
import { deleteData, insert } from '../db';
import { User } from '../../src/components/Users/Types';
import { Quote } from '../../src/components/Quotes/Types';

describe('GET /quotes/{id}', () => {
  let server: Server;
  let user: User;
  let quote: Quote;

  beforeAll(async () => {
    server = await getServer();
    const result = await insert('Users', buildUser());
    user = result[0] as User;
    const newQuote = buildQuote();
    newQuote.userId = user.id;
    const quoteResult = await insert('Quotes', newQuote);
    quote = quoteResult[0] as Quote;
  });

  afterAll(async () => {
    await deleteData('Quotes', { userId: user.id });
    await deleteData('Users', { id: user.id });
    await server.stop();
  });

  function getInjectOptions(id: number): ServerInjectOptions {
    return {
      method: 'get',
      url: `/quotes/${id}`,
      auth: {
        strategy: 'session',
        credentials: {
          id: user.id,
          userType: user.userType,
          scope: [user.userType],
        },
      },
    };
  }

  it('should return 401 if user is not logged in', async () => {
    const options: ServerInjectOptions = {
      method: 'get',
      url: `/quotes/1`,
    };

    const res = await server.inject(options);
    expect(res.statusCode).toEqual(401);
  });

  it('should return 404 if quote does not exist', async () => {
    const options = getInjectOptions(9999);
    const res = await server.inject(options);
    expect(res.statusCode).toEqual(404);
  });

  it('should return 403 if user tries to access quote that does not belong to them', async () => {
    const options = getInjectOptions(quote.id);
    options.auth.credentials.id = 999; // Simulate a different user
    const res = await server.inject(options);
    expect(res.statusCode).toEqual(403);
  });

  it('should return 200 and quote data if user accesses their own quote', async () => {
    const options = getInjectOptions(quote.id);
    const res = await server.inject(options);
    expect(res.statusCode).toEqual(200);
    const payload = JSON.parse(res.payload);
    expect(payload).toMatchObject({
      id: quote.id,
      userId: quote.userId,
      address: quote.address,
      monthlyConsumptionKwh: quote.monthlyConsumptionKwh,
      systemSizeKw: quote.systemSizeKw,
      downPayment: quote.downPayment,
      systemPrice: quote.systemPrice,
      principalAmount: quote.principalAmount,
      riskBand: quote.riskBand,
      monthlyPaymentAmount5Years: quote.monthlyPaymentAmount5Years,
      monthlyPaymentAmount10Years: quote.monthlyPaymentAmount10Years,
      monthlyPaymentAmount15Years: quote.monthlyPaymentAmount15Years,
    });
  });
});
