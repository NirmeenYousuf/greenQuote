import { insertQuote } from './Model';
import { knexTransaction } from '../../db';
import { Quote, QuoteInput } from './Types';

export async function createQuote({
  userId,
  quoteInput,
}: {
  userId: number;
  quoteInput: QuoteInput;
}) {
  const systemPrice = quoteInput.systemSizeKw * 1200;
  const principalAmount = quoteInput.downPayment
    ? systemPrice - quoteInput.downPayment
    : systemPrice;
  const riskBand =
    quoteInput.monthlyConsumptionKwh >= 400 && quoteInput.systemSizeKw <= 6
      ? 'A'
      : quoteInput.monthlyConsumptionKwh >= 250
        ? 'B'
        : 'C';
  //base APR by band is percentage
  const baseAPRByBand = riskBand === 'A' ? 6.9 : riskBand === 'B' ? 8.9 : 11.9;

  /*   
        amortization formula
        P(i + (i / ( (1 + i)^n - 1) ) )
        P = principal amount, i = periodic interest rate, n = total number of payments
        calculate values

        if the rate is stated in terms of "APR" and not "annual interest rate", then dividing by 12 is an appropriate means of determining the monthly interest rate.
    */

  const monthlyPayment5Years = calculateMonthlyPayment5Years(
    baseAPRByBand,
    principalAmount,
  );

  const monthlyPayment10Years = calculateMonthlyPayment10Years(
    baseAPRByBand,
    principalAmount,
  );

  const monthlyPayment15Years = calculateMonthlyPayment15Years(
    baseAPRByBand,
    principalAmount,
  );

  const payload = {
    userId: userId,
    address: quoteInput.address,
    monthlyConsumptionKwh: quoteInput.monthlyConsumptionKwh,
    systemSizeKw: quoteInput.systemSizeKw,
    downPayment: quoteInput.downPayment,
    systemPrice: systemPrice,
    principalAmount: principalAmount,
    riskBand: riskBand,
    monthlyPaymentAmount5Years: Number(monthlyPayment5Years.toFixed(2)),
    monthlyPaymentAmount10Years: Number(monthlyPayment10Years.toFixed(2)),
    monthlyPaymentAmount15Years: Number(monthlyPayment15Years.toFixed(2)),
    createdAt: new Date(),
  };

  let quote: Quote | null = null;

  await knexTransaction(async (trx) => {
    quote = await insertQuote({ payload, trx });
  });

  return quote;
}

function calculateMonthlyPayment5Years(
  baseAPRByBand: number,
  principalAmount: number,
) {
  const totalPayments5Years = 5 * 12; // 5 years * 12 months
  const monthlyInterestRate5Years = baseAPRByBand / 100 / 12; // Convert APR to monthly and decimal
  const monthlyPayment5Years =
    principalAmount *
    (monthlyInterestRate5Years +
      monthlyInterestRate5Years /
        (Math.pow(1 + monthlyInterestRate5Years, totalPayments5Years) - 1));
  return monthlyPayment5Years;
}

function calculateMonthlyPayment10Years(
  baseAPRByBand: number,
  principalAmount: number,
) {
  const totalPayments10Years = 10 * 12; // 10 years * 12 months
  const monthlyInterestRate10Years = baseAPRByBand / 100 / 12; // Convert APR to monthly and decimal
  const monthlyPayment10Years =
    principalAmount *
    (monthlyInterestRate10Years +
      monthlyInterestRate10Years /
        (Math.pow(1 + monthlyInterestRate10Years, totalPayments10Years) - 1));
  return monthlyPayment10Years;
}

function calculateMonthlyPayment15Years(
  baseAPRByBand: number,
  principalAmount: number,
) {
  const totalPayments15Years = 15 * 12; // 15 years * 12 months
  const monthlyInterestRate15Years = baseAPRByBand / 100 / 12; // Convert APR to monthly and decimal
  const monthlyPayment15Years =
    principalAmount *
    (monthlyInterestRate15Years +
      monthlyInterestRate15Years /
        (Math.pow(1 + monthlyInterestRate15Years, totalPayments15Years) - 1));
  return monthlyPayment15Years;
}
