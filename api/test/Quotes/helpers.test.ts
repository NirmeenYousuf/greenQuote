import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createQuote } from '../../src/components/Quotes/helpers';
import * as Model from '../../src/components/Quotes/Model';
import * as Db from '../../src/db';

vi.mock('../../src/components/Quotes/Model', () => ({
  insertQuote: vi.fn(),
}));

vi.mock('../../src/db', () => ({
  knexTransaction: vi.fn(),
}));

describe('helpers.ts', () => {
  const fakeTrx = { id: 'trx' } as any;

  vi.mocked(Model.insertQuote).mockResolvedValue({});

  // Mock transaction to execute callback
  vi.mocked(Db.knexTransaction).mockImplementation(async (callback: any) => {
    return callback(fakeTrx);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate systemPrice and principalAmount correctly in createQuote', async () => {
    const mockUserId = 1;
    const mockQuoteInput = {
      address: '123 Test St',
      monthlyConsumptionKwh: 300,
      systemSizeKw: 5,
      downPayment: 2000,
    };

    const systemPrice = mockQuoteInput.systemSizeKw * 1200;
    const principalAmount = systemPrice - mockQuoteInput.downPayment;

    await createQuote({ userId: mockUserId, quoteInput: mockQuoteInput });

    expect(Db.knexTransaction).toHaveBeenCalledTimes(1);

    expect(Model.insertQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          systemPrice: systemPrice,
          principalAmount: principalAmount,
        }),
        trx: fakeTrx,
      }),
    );
  });

  it('should calculate riskBand correctly in createQuote', async () => {
    const mockUserId = 1;
    const mockQuoteInput = {
      address: '123 Test St',
      monthlyConsumptionKwh: 450,
      systemSizeKw: 5,
      downPayment: 2000,
    };

    const riskBand = 'A'; // monthlyConsumptionKwh >= 400 && systemSizeKw <= 6

    await createQuote({ userId: mockUserId, quoteInput: mockQuoteInput });

    expect(Db.knexTransaction).toHaveBeenCalledTimes(1);

    expect(Model.insertQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          riskBand: riskBand,
        }),
        trx: fakeTrx,
      }),
    );
  });

  it('should calculate riskBand as B when monthlyConsumptionKwh is between 250 and 400', async () => {
    const mockUserId = 1;
    const mockQuoteInput = {
      address: '123 Test St',
      monthlyConsumptionKwh: 300,
      systemSizeKw: 7, // systemSizeKw > 6
      downPayment: 2000,
    };

    const riskBand = 'B'; // monthlyConsumptionKwh >= 250

    await createQuote({ userId: mockUserId, quoteInput: mockQuoteInput });

    expect(Db.knexTransaction).toHaveBeenCalledTimes(1);

    expect(Model.insertQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          riskBand: riskBand,
        }),
        trx: fakeTrx,
      }),
    );
  });

  it('should calculate riskBand as C when monthlyConsumptionKwh is below 250', async () => {
    const mockUserId = 1;
    const mockQuoteInput = {
      address: '123 Test St',
      monthlyConsumptionKwh: 200, // monthlyConsumptionKwh < 250
      systemSizeKw: 7,
      downPayment: 2000,
    };

    const riskBand = 'C'; // monthlyConsumptionKwh < 250

    await createQuote({ userId: mockUserId, quoteInput: mockQuoteInput });

    expect(Db.knexTransaction).toHaveBeenCalledTimes(1);

    expect(Model.insertQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          riskBand: riskBand,
        }),
        trx: fakeTrx,
      }),
    );
  });

  it('should handle missing downPayment by setting principalAmount equal to systemPrice', async () => {
    const mockUserId = 1;
    const mockQuoteInput = {
      address: '123 Test St',
      monthlyConsumptionKwh: 300,
      systemSizeKw: 5,
      downPayment: undefined, // No downPayment provided
    };

    const systemPrice = mockQuoteInput.systemSizeKw * 1200;
    const principalAmount = systemPrice; // No downPayment, so principalAmount = systemPrice

    await createQuote({ userId: mockUserId, quoteInput: mockQuoteInput });
    expect(Db.knexTransaction).toHaveBeenCalledTimes(1);
    expect(Model.insertQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          systemPrice: systemPrice,
          principalAmount: principalAmount,
        }),
        trx: fakeTrx,
      }),
    );
  });

  it('should call insertQuote with the correct payload and transaction', async () => {
    const mockUserId = 1;
    const mockQuoteInput = {
      address: '123 Test St',
      monthlyConsumptionKwh: 300,
      systemSizeKw: 5,
      downPayment: 2000,
    };

    await createQuote({ userId: mockUserId, quoteInput: mockQuoteInput });

    expect(Db.knexTransaction).toHaveBeenCalledTimes(1);
    expect(Model.insertQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.any(Object),
        trx: fakeTrx,
      }),
    );
  });
});
