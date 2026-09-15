import type { TicketStatus } from "@/types/ticket";

export type AccountStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DISABLED";

export type AdminCustomer = {
  userId: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  accountStatus: AccountStatus;
  createdAt: string;
};

export type AdminTicketLookup = {
  ticketId: string;
  ticketNumber: string;
  status: TicketStatus;
  orderId: string;
  userId: string | null;
  customerEmail: string | null;
  customerName: string | null;
  ticketTypeId: string;
  ticketTypeName: string;
  eventId: string;
  eventTitle: string;
  createdAt: string;
};
