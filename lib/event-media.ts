import type { Event } from "@/types/events";

export const EVENT_MEDIA_FALLBACK =
  "/media/events/eclipse-2026.jpg";

export function getEventCardImage(event: Event) {
  return (
    event.cardImageUrl ??
    event.heroImageUrl ??
    EVENT_MEDIA_FALLBACK
  );
}

export function getEventHeroImage(event: Event) {
  return (
    event.heroImageUrl ??
    event.cardImageUrl ??
    EVENT_MEDIA_FALLBACK
  );
}
