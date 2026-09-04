"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  TicketCheck,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/api/auth";
import { getPublishedEvents } from "@/lib/api/events";
import {
  getAttendanceSummary,
  getCheckInHistory,
  ScannerApiError,
} from "@/lib/api/scanner";
import type { CurrentUser } from "@/types/auth";
import type { Event } from "@/types/events";
import type {
  AttendanceSummary,
  CheckInHistory,
} from "@/types/scanner";

const ATTENDANCE_ROLES = new Set([
  "EVENT_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
]);

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: "Asia/Colombo",
    }
  ).format(new Date(value));
}

export function AttendanceClient() {
  const router = useRouter();
  const [user, setUser] = useState<
    CurrentUser | null | undefined
  >(undefined);
  const [events, setEvents] = useState<
    Event[] | null
  >(null);
  const [selectedEventId, setSelectedEventId] =
    useState("");
  const [summary, setSummary] =
    useState<AttendanceSummary | null>(null);
  const [history, setHistory] =
    useState<CheckInHistory[] | null>(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const authorized = Boolean(
    user?.roles.some((role) =>
      ATTENDANCE_ROLES.has(role)
    )
  );

  useEffect(() => {
    let active = true;

    const loadInitialState = async () => {
      try {
        const [currentUser, publishedEvents] =
          await Promise.all([
            getCurrentUser(),
            getPublishedEvents(),
          ]);

        if (!active) {
          return;
        }

        setUser(currentUser);
        setEvents(publishedEvents);

        if (publishedEvents[0]) {
          setSelectedEventId(
            publishedEvents[0].id
          );
        }
      } catch (caught) {
        if (!active) {
          return;
        }

        if (
          caught instanceof ScannerApiError &&
          caught.status === 401
        ) {
          router.replace(
            "/login?next=/operations/attendance"
          );
          return;
        }

        if (
          caught instanceof Error &&
          "status" in caught &&
          caught.status === 401
        ) {
          router.replace(
            "/login?next=/operations/attendance"
          );
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load attendance operations."
        );
      }
    };

    void loadInitialState();

    return () => {
      active = false;
    };
  }, [router]);

  const loadAttendance = useCallback(
    async (eventId: string) => {
      if (!eventId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [nextSummary, nextHistory] =
          await Promise.all([
            getAttendanceSummary(eventId),
            getCheckInHistory(eventId),
          ]);

        setSummary(nextSummary);
        setHistory(nextHistory);
        setLastUpdated(new Date());
      } catch (caught) {
        if (
          caught instanceof ScannerApiError &&
          caught.status === 401
        ) {
          router.replace(
            "/login?next=/operations/attendance"
          );
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load attendance data."
        );
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!authorized || !selectedEventId) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        void loadAttendance(
          selectedEventId
        );
      }, 0);

    return () =>
      window.clearTimeout(timeoutId);
  }, [
    authorized,
    loadAttendance,
    selectedEventId,
  ]);

  const attendanceRate = useMemo(() => {
    if (!summary?.ticketsIssued) {
      return 0;
    }

    return Math.round(
      (summary.checkedIn /
        summary.ticketsIssued) *
        100
    );
  }, [summary]);

  if (user === undefined || events === null) {
    return <AttendanceLoading />;
  }

  if (!authorized) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
        <ShieldAlert className="size-9 text-destructive" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          Operations access required.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Attendance reports are restricted
          to event managers and administrators.
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

  if (events.length === 0) {
    return (
      <div className="border border-white/10 bg-card/40 p-6 sm:p-8">
        <Activity className="size-9 text-electric" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          No published events.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Attendance becomes available after
          an event is published.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="border border-white/10 bg-card/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="attendanceEvent"
              className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              Published event
            </label>
            <select
              id="attendanceEvent"
              value={selectedEventId}
              onChange={(changeEvent) =>
                setSelectedEventId(
                  changeEvent.target.value
                )
              }
              className="mt-3 h-14 w-full border border-white/10 bg-background px-4 text-sm outline-none transition-colors focus:border-electric"
            >
              {events.map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadAttendance(
                selectedEventId
              )
            }
            disabled={loading}
            className="flex h-14 items-center gap-3 border border-white/10 px-5 transition-colors hover:border-electric/50 disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />
            <span className="font-technical text-[8px] uppercase tracking-[0.18em]">
              Refresh
            </span>
          </button>
        </div>

        {lastUpdated && (
          <p className="font-technical mt-4 text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
            Updated {lastUpdated.toLocaleTimeString(
              "en-GB"
            )}
          </p>
        )}
      </div>

      {error && (
        <div className="border border-destructive/30 bg-destructive/5 p-5 text-sm leading-6 text-destructive">
          {error}
        </div>
      )}

      {loading && !summary ? (
        <AttendanceLoading />
      ) : summary ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric
              label="Issued"
              value={summary.ticketsIssued}
              icon={<Users className="size-4" />}
            />
            <Metric
              label="Checked in"
              value={summary.checkedIn}
              icon={<TicketCheck className="size-4" />}
              accent
            />
            <Metric
              label="Remaining"
              value={summary.remaining}
              icon={<Activity className="size-4" />}
            />
          </div>

          <div className="border border-white/10 bg-card/40 p-5 sm:p-6">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                  Attendance rate
                </p>
                <p className="font-display mt-2 text-4xl tracking-[-0.05em]">
                  {attendanceRate}%
                </p>
              </div>
              <p className="max-w-56 text-right text-xs leading-5 text-muted-foreground">
                {summary.eventTitle}
              </p>
            </div>
            <div className="mt-5 h-1 overflow-hidden bg-white/10">
              <div
                className="h-full bg-electric transition-[width] duration-500"
                style={{
                  width: `${Math.min(
                    attendanceRate,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="border border-white/10 bg-card/40 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
                Recent check-ins
              </p>
              <span className="font-technical text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                {history?.length ?? 0} total
              </span>
            </div>

            {history?.length ? (
              <div>
                {history.map((entry) => (
                  <div
                    key={entry.checkInId}
                    className="grid gap-3 border-b border-white/10 py-5 last:border-0 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-sm">
                        {entry.ticketTypeName}
                      </p>
                      <p className="font-technical mt-2 break-all text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                        {entry.ticketNumber}
                      </p>
                      <p className="mt-2 break-all text-xs text-muted-foreground">
                        {entry.attendeeEmail ??
                          "Guest ticket"}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs">
                        {formatTimestamp(
                          entry.checkedInAt
                        )}
                      </p>
                      <p className="font-technical mt-2 text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                        {entry.scannedByEmail ??
                          "Staff user"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-sm text-muted-foreground">
                No tickets have been checked in
                for this event yet.
              </p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function AttendanceLoading() {
  return (
    <div className="border border-white/10 bg-card/40 p-6">
      <LoaderCircle className="size-5 animate-spin text-electric" />
      <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        Loading attendance
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="border border-white/10 bg-card/40 p-5">
      <div
        className={
          accent
            ? "text-electric"
            : "text-muted-foreground"
        }
      >
        {icon}
      </div>
      <p className="font-display mt-7 text-4xl tracking-[-0.05em]">
        {value}
      </p>
      <p className="font-technical mt-2 text-[7px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
