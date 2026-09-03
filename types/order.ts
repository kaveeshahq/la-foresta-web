export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PAYMENT_FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderItem = {
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
};

export type Order = {
  orderId: string;
  reservationId: string;
  status: OrderStatus;

  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;

  promoCode: string | null;

  currency: string;
  items: OrderItem[];

  createdAt: string;
  updatedAt: string;
};

export type CreateOrderRequest = {
  reservationId: string;
  promoCode: string | null;
};

export type GuestOrderResponse = {
  order: Order;
  guestAccessToken: string;
};