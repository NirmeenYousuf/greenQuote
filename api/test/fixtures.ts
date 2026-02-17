import { UserType } from '../src/components/Users/Types';

export function buildUser() {
  return {
    //id: 1000,
    name: 'api test user',
    email: 'apitesting@test.com',
    password: 'password',
    userType: UserType.user,
    createdAt: new Date(),
  };
}

export function buildQuote() {
  return {
    userId: 1,
    address: 'test address',
    monthlyConsumptionKwh: 150,
    systemSizeKw: 150,
    downPayment: 10,
    systemPrice: 1500,
    principalAmount: 1200,
    riskBand: 'A',
    monthlyPaymentAmount5Years: 120,
    monthlyPaymentAmount10Years: 150,
    monthlyPaymentAmount15Years: 130,
    createdAt: new Date(),
  };
}
