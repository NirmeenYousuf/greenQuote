export interface Quote {
  id: string;
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
  createdAt: string;
}

export interface QuoteListResult {
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
  createdAt: string;
}

export interface QuoteListResponse {
  results: QuoteListResult[];
  totalCount: number;
}
