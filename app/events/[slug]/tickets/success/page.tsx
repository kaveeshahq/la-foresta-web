import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { GuestTicketSuccess } from "@/components/ticketing/guest-ticket-success";

type SuccessPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SuccessPage({
  params,
}: SuccessPageProps) {
  const { slug } =
    await params;

  return (
    <>
      <SiteHeader />

      <main className="min-h-[100svh] bg-background pt-24 sm:pt-28">
        <GuestTicketSuccess
          eventSlug={slug}
        />
      </main>

      <SiteFooter />
    </>
  );
}