import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { GuestTicketAccess } from "@/components/ticketing/guest-ticket-access";

export const metadata: Metadata = {
  title: "Guest Tickets",
  robots: {
    index: false,
    follow: false,
  },
};

type GuestTicketsPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function GuestTicketsPage({
  searchParams,
}: GuestTicketsPageProps) {
  const { token } = await searchParams;

  const accessToken =
    typeof token === "string" &&
    token.trim().length > 0
      ? token
      : null;

  return (
    <>
      <SiteHeader />

      <main className="min-h-[100svh] bg-background pt-24 print:bg-white print:pt-0">
        <GuestTicketAccess
          accessToken={accessToken}
        />
      </main>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
