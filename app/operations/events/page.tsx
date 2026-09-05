import { AuthShell } from "@/components/auth/auth-shell";
import { EventManagementClient } from "@/components/operations/event-management-client";

export default function EventManagementPage() {
  return (
    <AuthShell
      eyebrow="Operations / Events"
      title={
        <>
          Event
          <br />
          studio
        </>
      }
      description="Create venues and events, configure ticket inventory, and publish experiences to the public site."
    >
      <EventManagementClient />
    </AuthShell>
  );
}
