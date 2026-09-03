export type ReservationStatus =
  | "ACTIVE"
  | "CONFIRMED"
  | "EXPIRED"
  | "CANCELLED";

export type ReservationItemRequest = {
  ticketTypeId: string;
  quantity: number;
};

export type CreateReservationRequest = {
  items: ReservationItemRequest[];
};

export type GuestReservationRequest = {
  guestEmail: string;
  guestName: string;
  items: ReservationItemRequest[];
};

export type ReservationItem = {
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
};

export type Reservation = {
  reservationId: string;
  status: ReservationStatus;
  expiresAt: string;
  items: ReservationItem[];
  totalAmount: number;
  currency: string;
};