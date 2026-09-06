import type { Event } from "@/types/events";
import type { TicketType } from "@/types/ticket-type";

export type Venue = {
  id: string;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateVenuePayload = {
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type SaveEventPayload = {
  venueId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  salesStartAt: string | null;
  salesEndAt: string | null;
  minimumAge: number;
};

export type CreateTicketTypePayload = {
  name: string;
  description: string | null;
  price: number;
  currency: string;
  capacity: number;
  maxPerOrder: number;
  salesStartAt: string | null;
  salesEndAt: string | null;
};

export type UpdateTicketTypePayload =
  CreateTicketTypePayload & {
    active: boolean;
  };

export type ManagedEvent = Event & {
  ticketTypes?: TicketType[];
};
