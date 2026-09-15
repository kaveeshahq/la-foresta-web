import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { SupportDeskClient } from "@/components/operations/support-desk-client";

export const metadata: Metadata = {
  title: "Support Desk",
  description:
    "Protected customer, order and ticket lookup for La Foresta support staff.",
};

export default function SupportDeskPage() {
  return (
    <AuthShell
      eyebrow="Operations / Support"
      title={
        <>
          Find
          <br />
          the answer
        </>
      }
      description="Look up customer accounts, guest and registered purchases, and individual ticket records without exposing access credentials."
    >
      <SupportDeskClient />
    </AuthShell>
  );
}
