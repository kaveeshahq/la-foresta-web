import type { TicketStatus } from "@/types/ticket";

export type ScannerTicketLookup = {
  ticketId: string;
  ticketNumber: string;
  status: TicketStatus;
  ticketTypeName: string;
  eventTitle: string;
  attendeeEmail: string | null;
  checkedInAt: string | null;
};

export type CheckInResponse = {
  ticketId: string;
  ticketNumber: string;
  ticketTypeName: string;
  eventTitle: string;
  result: "CHECKED_IN";
  checkedInAt: string;
};

export type AttendanceSummary = {
  eventId: string;
  eventTitle: string;
  ticketsIssued: number;
  checkedIn: number;
  remaining: number;
};

export type CheckInHistory = {
  checkInId: string;
  ticketId: string;
  ticketNumber: string;
  ticketTypeName: string;
  attendeeEmail: string | null;
  scannedByEmail: string | null;
  checkedInAt: string;
};
