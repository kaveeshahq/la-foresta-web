"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type ReservationTimerProps = {
  expiresAt: string;
  onExpire?: () => void;
};

function getRemainingSeconds(
  expiresAt: string
) {
  const remaining =
    new Date(expiresAt).getTime() -
    Date.now();

  return Math.max(
    0,
    Math.ceil(remaining / 1000)
  );
}

function formatRemainingTime(
  seconds: number
) {
  const minutes = Math.floor(
    seconds / 60
  );

  const remainingSeconds =
    seconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function ReservationTimer({
  expiresAt,
  onExpire,
}: ReservationTimerProps) {
  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(() =>
    getRemainingSeconds(expiresAt)
  );

  useEffect(() => {
    let expiredCalled = false;

    const update = () => {
      const next =
        getRemainingSeconds(
          expiresAt
        );

      setRemainingSeconds(next);

      if (
        next === 0 &&
        !expiredCalled
      ) {
        expiredCalled = true;
        onExpire?.();
      }
    };

    update();

    const interval =
      window.setInterval(
        update,
        1000
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    expiresAt,
    onExpire,
  ]);

  const formatted =
    useMemo(
      () =>
        formatRemainingTime(
          remainingSeconds
        ),
      [remainingSeconds]
    );

  const expired =
    remainingSeconds === 0;

  return (
    <div className="mt-4">
      <p
        className={`font-display text-5xl tracking-[-0.05em] ${
          expired
            ? "text-destructive"
            : "text-foreground"
        }`}
      >
        {formatted}
      </p>

      <p className="font-technical mt-3 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
        {expired
          ? "Reservation expired"
          : "Minutes / seconds"}
      </p>
    </div>
  );
}