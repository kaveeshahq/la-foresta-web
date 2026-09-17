export type DiscountType =
  | "FIXED_AMOUNT"
  | "PERCENTAGE";

export type AdminPromoCode = {
  id: string;
  eventId: string | null;
  eventTitle: string | null;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  redemptionCount: number;
  remainingUses: number | null;
  validFrom: string | null;
  validUntil: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SavePromoCodePayload = {
  eventId: string | null;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  validFrom: string | null;
  validUntil: string | null;
  active: boolean;
};
