import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your role-aware La Foresta account and operations workspace.",
};

export default function DashboardPage() {
  return (
    <AuthShell
      eyebrow="Workspace / Dashboard"
      title={
        <>
          Your
          <br />
          workspace
        </>
      }
      description="One secure starting point for tickets, purchases and the operational tools assigned to your account."
    >
      <DashboardClient />
    </AuthShell>
  );
}
