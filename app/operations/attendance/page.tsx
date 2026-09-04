import { AttendanceClient } from "@/components/operations/attendance-client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AttendancePage() {
  return (
    <AuthShell
      eyebrow="Operations / Attendance"
      title={
        <>
          Live
          <br />
          attendance
        </>
      }
      description="Monitor issued tickets, venue admissions and the latest staff check-ins for a published event."
    >
      <AttendanceClient />
    </AuthShell>
  );
}
