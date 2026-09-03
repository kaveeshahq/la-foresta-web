export type TicketType = {
  id: string;
  eventId: string;
  eventTitle: string;

  name: string;
  description: string | null;

  price: number;
  currency: string;

  capacity: number;
  maxPerOrder: number;

  salesStartAt: string | null;
  salesEndAt: string | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;
};