import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How La Foresta collects, uses and protects information across its event and ticketing platform.",
};

const sections = [
  {
    title: "Information we collect",
    content: (
      <>
        <p>
          We collect information you provide when creating an account, buying or reserving tickets, requesting account support, or otherwise using the platform. This may include your name, email address, account credentials, order details and ticket-holder information.
        </p>
        <p>
          We also process transaction references and payment status supplied by our payment workflow. Complete card or bank credentials should be entered only through the payment provider presented during checkout and are not intended to be stored by La Foresta.
        </p>
      </>
    ),
  },
  {
    title: "How we use information",
    content: (
      <>
        <p>We use information where needed to:</p>
        <ul>
          <li>create and secure accounts and authenticated sessions;</li>
          <li>hold ticket inventory, process orders and confirm payments;</li>
          <li>issue tickets, QR credentials and guest access links;</li>
          <li>validate entry, record check-ins and prevent duplicate or fraudulent use;</li>
          <li>provide event, order and customer support communications;</li>
          <li>maintain platform security, reliability and legal compliance.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Guest access and QR tickets",
    content: (
      <p>
        Guest ticket links and QR codes act as access credentials. Anyone who receives one may be able to view or use the associated ticket, so keep them private and contact the organiser promptly if you believe one has been exposed. We store protected representations of guest access tokens where supported by the platform.
      </p>
    ),
  },
  {
    title: "Cookies and sessions",
    content: (
      <p>
        The site may use cookies or similar browser storage that are necessary for sign-in, session continuity, checkout recovery, security and user preferences. Disabling essential storage can prevent account and checkout features from working correctly.
      </p>
    ),
  },
  {
    title: "Sharing and service providers",
    content: (
      <p>
        We may share only the information needed with providers that support hosting, payments, email delivery, security and event operations. Information may also be disclosed when required by law, to protect users or the platform, or as part of a legitimate business reorganisation. We do not sell personal information as a standalone product.
      </p>
    ),
  },
  {
    title: "Retention and security",
    content: (
      <p>
        Information is retained for as long as reasonably required to deliver tickets and events, maintain transaction and check-in records, resolve disputes, prevent abuse, and satisfy accounting or legal duties. We use reasonable technical and organisational safeguards, but no internet service can guarantee absolute security.
      </p>
    ),
  },
  {
    title: "Your choices",
    content: (
      <p>
        Depending on applicable law, you may ask to access, correct or delete personal information, or object to certain processing. Some transaction and attendance records may need to be retained for legal, security or operational reasons. Use the official contact details in your ticket receipt or event communication to submit a privacy request and verify your identity.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy as the platform, payment methods or legal requirements change. The date at the top identifies the latest version. Material updates should be communicated through the site or an appropriate account or event channel.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal / Privacy"
      title="PRIVACY"
      introduction="This policy explains how the La Foresta event and ticketing platform handles information when you browse events, create an account, purchase tickets or enter an event."
      lastUpdated="05 September 2026"
      sections={sections}
    />
  );
}
