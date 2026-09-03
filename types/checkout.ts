import type {
  ReservationItemRequest,
} from "@/types/reservation";

export type TicketSelection = {
  eventId: string;
  eventSlug: string;
  items: ReservationItemRequest[];
};