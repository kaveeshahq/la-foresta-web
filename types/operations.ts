import type {
  OrderItem,
  OrderStatus,
} from "@/types/order";
import type { TicketStatus } from "@/types/ticket";

export type AdminOrderSummary = {
  orderId: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  status: OrderStatus;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  promoCode: string | null;
  currency: string;
  createdAt: string;
};

export type AdminPayment = {
  paymentId: string;
  provider: "MOCK" | "PAYHERE";
  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED";
  providerReference: string | null;
  amount: number;
  currency: string;
  createdAt: string;
};

export type AdminRefund = {
  refundId: string;
  provider: "MOCK" | "PAYHERE";
  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED";
  amount: number;
  currency: string;
  reason: string | null;
  providerReference: string | null;
  createdAt: string;
};

export type AdminTicket = {
  ticketId: string;
  ticketNumber: string;
  status: TicketStatus;
  ticketTypeId: string;
  ticketTypeName: string;
};

export type AdminOrder = {
  orderId: string;
  userId: string;
  customerEmail: string;
  reservationId: string;
  status: OrderStatus;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  promoCode: string | null;
  currency: string;
  items: OrderItem[];
  payments: AdminPayment[];
  refunds: AdminRefund[];
  tickets: AdminTicket[];
  createdAt: string;
  updatedAt: string;
};

export type RefundResponse = {
  refundId: string;
  orderId: string;
  paymentTransactionId: string | null;
  provider: "MOCK" | "PAYHERE";
  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED";
  amount: number;
  currency: string;
  reason: string | null;
  providerReference: string | null;
  createdAt: string;
  updatedAt: string;
};
