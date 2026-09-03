export type EventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "SOLD_OUT"
  | "CANCELLED"
  | "COMPLETED";

export type Event = {
  id: string;
  venueId: string | null;
  venueName: string | null;

  title: string;
  slug: string;

  shortDescription: string | null;
  description: string | null;

  status: EventStatus;

  startsAt: string;
  endsAt: string | null;

  salesStartAt: string | null;
  salesEndAt: string | null;

  minimumAge: number;

  createdAt: string;
  updatedAt: string;
};
