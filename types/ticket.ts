export type TicketStatus =
  | "VALID"
  | "USED"
  | "CANCELLED"
  | "REFUNDED";

export type Ticket = {
  ticketId: string;
  ticketNumber: string;
  qrToken: string;

  status: TicketStatus;

  orderId: string;

  ticketTypeId: string;
  ticketTypeName: string;

  eventId: string;
  eventTitle: string;
  eventSlug: string;

  eventStartsAt: string;
  createdAt: string;
};