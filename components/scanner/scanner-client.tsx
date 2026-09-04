"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  CameraOff,
  Check,
  LoaderCircle,
  RotateCcw,
  ScanLine,
  ShieldAlert,
  TicketCheck,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  checkInScannerTicket,
  lookupScannerTicket,
  ScannerApiError,
} from "@/lib/api/scanner";
import { getCurrentUser } from "@/lib/api/auth";
import type { CurrentUser } from "@/types/auth";
import type {
  CheckInResponse,
  ScannerTicketLookup,
} from "@/types/scanner";

const SCANNER_ROLES = new Set([
  "SCANNER_STAFF",
  "ADMIN",
  "SUPER_ADMIN",
]);

type CameraState =
  | "idle"
  | "starting"
  | "active"
  | "unsupported"
  | "denied";

type DetectedBarcode = {
  rawValue?: string;
};

type BarcodeDetectorInstance = {
  detect(
    source: HTMLVideoElement
  ): Promise<DetectedBarcode[]>;
};

type BarcodeDetectorConstructor = new (
  options: {
    formats: string[];
  }
) => BarcodeDetectorInstance;

function getBarcodeDetector() {
  return (
    window as typeof window & {
      BarcodeDetector?: BarcodeDetectorConstructor;
    }
  ).BarcodeDetector;
}

function formatCheckedInAt(value: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: "Asia/Colombo",
    }
  ).format(new Date(value));
}

export function ScannerClient() {
  const router = useRouter();
  const videoRef =
    useRef<HTMLVideoElement>(null);
  const streamRef =
    useRef<MediaStream | null>(null);
  const intervalRef =
    useRef<number | null>(null);
  const detectingRef = useRef(false);

  const [user, setUser] = useState<
    CurrentUser | null | undefined
  >(undefined);
  const [qrToken, setQrToken] =
    useState("");
  const [ticket, setTicket] =
    useState<ScannerTicketLookup | null>(
      null
    );
  const [checkIn, setCheckIn] =
    useState<CheckInResponse | null>(null);
  const [error, setError] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(false);
  const [cameraState, setCameraState] =
    useState<CameraState>("idle");

  const canScan = Boolean(
    user?.roles.some((role) =>
      SCANNER_ROLES.has(role)
    )
  );

  const stopCamera = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(
        intervalRef.current
      );
      intervalRef.current = null;
    }

    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    detectingRef.current = false;
  }, []);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const currentUser =
          await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
          router.replace(
            "/login?next=/scanner"
          );
        }
      }
    };

    void loadUser();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    return stopCamera;
  }, [stopCamera]);

  const handleApiError = useCallback(
    (caught: unknown, fallback: string) => {
      if (
        caught instanceof ScannerApiError &&
        caught.status === 401
      ) {
        router.replace(
          "/login?next=/scanner"
        );
        return;
      }

      if (
        caught instanceof ScannerApiError &&
        caught.status === 403
      ) {
        setError(
          "Your account is not authorized for venue check-in."
        );
        return;
      }

      setError(
        caught instanceof Error
          ? caught.message
          : fallback
      );
    },
    [router]
  );

  const lookupToken = useCallback(
    async (value: string) => {
      const normalized = value.trim();

      if (!normalized) {
        setError("Enter or scan a QR token.");
        return;
      }

      setLoading(true);
      setError(null);
      setTicket(null);
      setCheckIn(null);
      setQrToken(normalized);

      try {
        const result =
          await lookupScannerTicket(
            normalized
          );
        setTicket(result);
      } catch (caught) {
        handleApiError(
          caught,
          "Unable to look up this ticket."
        );
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  const startCamera = useCallback(
    async () => {
      stopCamera();
      setError(null);
      setCameraState("starting");

      const BarcodeDetectorApi =
        getBarcodeDetector();

      if (
        !BarcodeDetectorApi ||
        !navigator.mediaDevices
          ?.getUserMedia
      ) {
        setCameraState("unsupported");
        return;
      }

      try {
        const stream =
          await navigator.mediaDevices
            .getUserMedia({
              audio: false,
              video: {
                facingMode: {
                  ideal: "environment",
                },
              },
            });

        const video = videoRef.current;

        if (!video) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );
          setCameraState("idle");
          return;
        }

        streamRef.current = stream;
        video.srcObject = stream;
        await video.play();

        const detector =
          new BarcodeDetectorApi({
            formats: ["qr_code"],
          });

        setCameraState("active");

        intervalRef.current =
          window.setInterval(
            async () => {
              if (
                video.readyState < 2 ||
                detectingRef.current
              ) {
                return;
              }

              detectingRef.current = true;

              try {
                const barcodes =
                  await detector.detect(video);
                const value =
                  barcodes[0]?.rawValue?.trim();

                if (value) {
                  stopCamera();
                  setCameraState("idle");
                  void lookupToken(value);
                }
              } catch {
                // Keep the camera active after a transient frame error.
              } finally {
                detectingRef.current = false;
              }
            },
            450
          );
      } catch {
        stopCamera();
        setCameraState("denied");
      }
    },
    [lookupToken, stopCamera]
  );

  const handleLookupSubmit = async (
    submitEvent: FormEvent<HTMLFormElement>
  ) => {
    submitEvent.preventDefault();
    stopCamera();
    setCameraState("idle");
    await lookupToken(qrToken);
  };

  const handleCheckIn = async () => {
    if (!ticket || ticket.status !== "VALID") {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result =
        await checkInScannerTicket(qrToken);

      setCheckIn(result);
      setTicket((current) =>
        current
          ? {
              ...current,
              status: "USED",
              checkedInAt:
                result.checkedInAt,
            }
          : current
      );
    } catch (caught) {
      handleApiError(
        caught,
        "Unable to check in this ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    stopCamera();
    setCameraState("idle");
    setQrToken("");
    setTicket(null);
    setCheckIn(null);
    setError(null);
  };

  if (user === undefined || user === null) {
    return <ScannerLoading />;
  }

  if (!canScan) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
        <ShieldAlert className="size-9 text-destructive" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          Staff access required.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          This account does not have a
          scanner or administrator role.
        </p>
        <Link
          href="/account"
          className="font-technical mt-8 inline-block text-[9px] uppercase tracking-[0.2em] text-electric"
        >
          Return to account
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="border border-white/10 bg-card/40 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-electric">
              Scanner authorized
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <ScanLine className="size-6 text-electric" />
        </div>

        <div className="relative mt-6 aspect-[4/3] overflow-hidden border border-white/10 bg-black">
          <video
            ref={videoRef}
            muted
            playsInline
            className={`size-full object-cover ${
              cameraState === "active"
                ? "opacity-100"
                : "opacity-0"
            }`}
          />

          {cameraState === "active" && (
            <div className="pointer-events-none absolute inset-[12%] border border-electric/70">
              <span className="absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-electric/70 shadow-[0_0_18px_rgba(79,255,130,0.7)]" />
            </div>
          )}

          {cameraState !== "active" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-7 text-center">
              {cameraState === "starting" ? (
                <LoaderCircle className="size-8 animate-spin text-electric" />
              ) : (
                <Camera className="size-8 text-muted-foreground" />
              )}
              <p className="font-technical mt-5 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                {cameraState === "unsupported"
                  ? "Camera QR detection is unavailable"
                  : cameraState === "denied"
                    ? "Camera permission was denied"
                    : cameraState === "starting"
                      ? "Starting camera"
                      : "Camera is off"}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={
            cameraState === "active"
              ? () => {
                  stopCamera();
                  setCameraState("idle");
                }
              : startCamera
          }
          disabled={cameraState === "starting"}
          className="mt-4 flex min-h-12 w-full items-center justify-between border border-white/10 px-4 transition-colors hover:border-electric/50 disabled:opacity-50"
        >
          <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
            {cameraState === "active"
              ? "Stop camera"
              : "Scan QR with camera"}
          </span>
          {cameraState === "active" ? (
            <CameraOff className="size-4" />
          ) : (
            <Camera className="size-4" />
          )}
        </button>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-technical text-[7px] uppercase tracking-[0.18em] text-muted-foreground">
            Or enter token
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleLookupSubmit}>
          <label
            htmlFor="qrToken"
            className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            QR token
          </label>
          <input
            id="qrToken"
            type="text"
            value={qrToken}
            onChange={(changeEvent) =>
              setQrToken(
                changeEvent.target.value
              )
            }
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={512}
            placeholder="Paste or scan token"
            className="mt-3 h-14 w-full border border-white/10 bg-transparent px-4 font-technical text-xs outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-electric"
          />
          <button
            type="submit"
            disabled={loading || !qrToken.trim()}
            className="mt-3 flex min-h-12 w-full items-center justify-between bg-electric px-4 text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
              {loading
                ? "Checking..."
                : "Look up ticket"}
            </span>
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ScanLine className="size-4" />
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start gap-3">
            <X className="mt-0.5 size-5 shrink-0 text-destructive" />
            <p className="text-sm leading-6 text-destructive">
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={resetScanner}
            className="font-technical mt-5 text-[8px] uppercase tracking-[0.18em] text-foreground"
          >
            Clear and scan again
          </button>
        </div>
      )}

      {ticket && (
        <TicketResult
          ticket={ticket}
          checkIn={checkIn}
          loading={loading}
          onCheckIn={handleCheckIn}
          onReset={resetScanner}
        />
      )}
    </div>
  );
}

function ScannerLoading() {
  return (
    <div className="border border-white/10 bg-card/40 p-6">
      <span className="block size-2 animate-pulse rounded-full bg-electric" />
      <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        Verifying staff access
      </p>
    </div>
  );
}

function TicketResult({
  ticket,
  checkIn,
  loading,
  onCheckIn,
  onReset,
}: {
  ticket: ScannerTicketLookup;
  checkIn: CheckInResponse | null;
  loading: boolean;
  onCheckIn: () => void;
  onReset: () => void;
}) {
  const valid = ticket.status === "VALID";
  const admitted =
    ticket.status === "USED";

  return (
    <div
      className={`border p-6 sm:p-8 ${
        valid || checkIn
          ? "border-electric/35 bg-electric/[0.04]"
          : "border-amber-400/35 bg-amber-400/[0.04]"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        {checkIn ? (
          <TicketCheck className="size-9 text-electric" />
        ) : valid ? (
          <Check className="size-9 text-electric" />
        ) : (
          <ShieldAlert className="size-9 text-amber-300" />
        )}

        <span
          className={`border px-3 py-2 font-technical text-[8px] uppercase tracking-[0.18em] ${
            valid || checkIn
              ? "border-electric/30 text-electric"
              : "border-amber-400/30 text-amber-300"
          }`}
        >
          {checkIn
            ? "Checked in"
            : ticket.status}
        </span>
      </div>

      <p className="font-technical mt-8 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
        {ticket.eventTitle}
      </p>
      <h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">
        {ticket.ticketTypeName}
      </h2>

      <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
        <div>
          <p className="font-technical text-[7px] uppercase tracking-[0.18em] text-muted-foreground">
            Ticket number
          </p>
          <p className="mt-2 break-all text-sm">
            {ticket.ticketNumber}
          </p>
        </div>
        <div>
          <p className="font-technical text-[7px] uppercase tracking-[0.18em] text-muted-foreground">
            Attendee
          </p>
          <p className="mt-2 break-all text-sm">
            {ticket.attendeeEmail ??
              "Guest ticket"}
          </p>
        </div>
      </div>

      {ticket.checkedInAt && (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="font-technical text-[7px] uppercase tracking-[0.18em] text-muted-foreground">
            Checked in at
          </p>
          <p className="mt-2 text-sm">
            {formatCheckedInAt(
              ticket.checkedInAt
            )}
          </p>
        </div>
      )}

      {valid && !checkIn ? (
        <button
          type="button"
          onClick={onCheckIn}
          disabled={loading}
          className="mt-7 flex min-h-14 w-full items-center justify-between bg-electric px-5 text-background disabled:cursor-wait disabled:opacity-50"
        >
          <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
            {loading
              ? "Admitting..."
              : "Confirm check-in"}
          </span>
          {loading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onReset}
          className="mt-7 flex min-h-12 w-full items-center justify-between border border-white/15 px-4"
        >
          <span className="font-technical text-[8px] uppercase tracking-[0.18em]">
            {admitted || checkIn
              ? "Scan next ticket"
              : "Clear result"}
          </span>
          <RotateCcw className="size-4" />
        </button>
      )}
    </div>
  );
}
