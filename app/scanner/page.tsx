import { ScannerClient } from "@/components/scanner/scanner-client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ScannerPage() {
  return (
    <AuthShell
      eyebrow="Staff / Entry Control"
      title={
        <>
          Scan
          <br />
          admit
        </>
      }
      description="Look up a ticket before admitting its holder. Check-in is restricted to scanner staff and authorized administrators."
    >
      <ScannerClient />
    </AuthShell>
  );
}
