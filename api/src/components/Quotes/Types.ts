export interface Quote {
  id: number;
  userId: number;
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment?: number;
  systemPrice: number;
  principalAmount: number;
  riskBand: string;
  monthlyPaymentAmount5Years: number;
  monthlyPaymentAmount10Years: number;
  monthlyPaymentAmount15Years: number;
  createdAt: Date;
}

export interface QuoteInput {
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment?: number;
}

export interface QuoteListResponse {
  id: number;
  userId: number;
  name: string;
  email: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  riskBand: string;
  monthlyPaymentAmount5Years: number;
  monthlyPaymentAmount10Years: number;
  monthlyPaymentAmount15Years: number;
  createdAt: Date;
}
