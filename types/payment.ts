export type PaymentProvider =
  | "MOCK"
  | "PAYHERE";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export type Payment = {
  paymentId: string;
  orderId: string;

  provider: PaymentProvider;
  status: PaymentStatus;

  providerReference: string | null;

  amount: number;
  currency: string;

  createdAt: string;
  updatedAt: string;
};

export type InitiatePaymentRequest = {
  orderId: string;
};