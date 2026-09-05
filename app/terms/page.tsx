import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of the La Foresta event and ticketing platform.",
};

const sections = [
  {
    title: "Using the platform",
    content: (
      <p>
        By using this site or placing an order, you agree to these terms and any event-specific conditions displayed during purchase. You must provide accurate information, use the platform lawfully and be able to enter a binding agreement under applicable law. If you purchase for another attendee, you are responsible for making the relevant conditions available to them.
      </p>
    ),
  },
  {
    title: "Accounts and guest access",
    content: (
      <p>
        You are responsible for safeguarding your password, authenticated session, guest ticket link and QR codes. Do not share credentials except when intentionally transferring a ticket in a manner permitted by the organiser. Notify the organiser through an official event communication channel if you suspect unauthorised access.
      </p>
    ),
  },
  {
    title: "Reservations and orders",
    content: (
      <>
        <p>
          A reservation may hold inventory only for the time shown during checkout. It does not guarantee admission until payment is successfully confirmed and valid tickets are issued. Expired, cancelled or failed reservations may be released automatically.
        </p>
        <p>
          Ticket quantities, availability, fees and totals shown at checkout form part of the order. Please review them before confirming payment. We may reject or cancel orders affected by fraud, abuse, technical errors or inventory discrepancies and will handle any captured payment appropriately.
        </p>
      </>
    ),
  },
  {
    title: "Tickets and entry",
    content: (
      <>
        <p>
          Each QR ticket is a unique entry credential and may be accepted only once unless the event expressly allows re-entry. The first valid scan may invalidate later copies. Altered, duplicated, fraudulently obtained or unauthorised resale tickets may be refused.
        </p>
        <p>
          Admission remains subject to the event&apos;s age requirements, identification rules, prohibited-items policy, venue capacity, safety directions and code of conduct. Holding a ticket does not remove the obligation to comply with those requirements.
        </p>
      </>
    ),
  },
  {
    title: "Changes, cancellations and refunds",
    content: (
      <p>
        Event schedules, artists, venues and production details may change where reasonably necessary. Refund eligibility depends on applicable law and the event-specific policy presented for the relevant order. Unless required by law or explicitly offered, changes to individual programme elements do not automatically entitle a holder to a refund. Approved refunds are returned through the supported payment process and may require processing time.
      </p>
    ),
  },
  {
    title: "Behaviour and safety",
    content: (
      <p>
        Attendees must follow reasonable instructions from venue, security, medical and event staff. Entry may be denied or an attendee removed for unsafe, unlawful, abusive or disruptive conduct, possession of prohibited items, or conduct that threatens the experience or safety of others. Any refund in those circumstances is subject to applicable law.
      </p>
    ),
  },
  {
    title: "Platform availability",
    content: (
      <p>
        We aim to keep event, account and ticket services accurate and available, but maintenance, network failures and third-party services can cause interruptions. To the extent permitted by law, the platform is provided without a guarantee of uninterrupted or error-free operation. Nothing in these terms excludes rights or liability that cannot legally be excluded.
      </p>
    ),
  },
  {
    title: "Updates and contact",
    content: (
      <p>
        These terms may be updated when the platform or applicable requirements change. The version governing an order is the version made available when that order is placed, together with its event-specific conditions. For order or event questions, use the official contact details included in your receipt or event communication.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal / Terms"
      title="TERMS"
      introduction="These terms set the ground rules for using La Foresta’s website, reservations, orders and digital tickets. Event-specific conditions shown during checkout also apply."
      lastUpdated="05 September 2026"
      sections={sections}
    />
  );
}
