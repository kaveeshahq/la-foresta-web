import { AuthShell } from "@/components/auth/auth-shell";
import { PromotionManagementClient } from "@/components/operations/promotion-management-client";

export default function PromotionManagementPage() {
  return (
    <AuthShell
      eyebrow="Operations / Promotions"
      title={
        <>
          Shape
          <br />
          demand
        </>
      }
      description="Create event or platform-wide offers, control redemption windows and limits, and pause campaigns instantly."
    >
      <PromotionManagementClient />
    </AuthShell>
  );
}
