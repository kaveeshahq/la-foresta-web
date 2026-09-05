"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  getCurrentUser,
  logout,
} from "@/lib/api/auth";
import type { CurrentUser } from "@/types/auth";

const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Experience",
    href: "/#experience",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "About",
    href: "/about",
  },
];

export function SiteHeader() {
  const router = useRouter();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    currentUser,
    setCurrentUser,
  ] = useState<
    CurrentUser | null | undefined
  >(undefined);

  const reduceMotion =
    useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 40
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [menuOpen]);

  useEffect(() => {
    let active = true;

    const loadCurrentUser = async () => {
      try {
        const user =
          await getCurrentUser();

        if (active) {
          setCurrentUser(user);
        }
      } catch {
        if (active) {
          setCurrentUser(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setCurrentUser(null);
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  const canAccessScanner =
    currentUser?.roles.some((role) =>
      [
        "SCANNER_STAFF",
        "ADMIN",
        "SUPER_ADMIN",
      ].includes(role)
    ) ?? false;

  const canAccessAttendance =
    currentUser?.roles.some((role) =>
      [
        "EVENT_MANAGER",
        "ADMIN",
        "SUPER_ADMIN",
      ].includes(role)
    ) ?? false;

  const canAccessEventManagement =
    currentUser?.roles.some((role) =>
      [
        "EVENT_MANAGER",
        "ADMIN",
        "SUPER_ADMIN",
      ].includes(role)
    ) ?? false;

  const canAccessOrderOperations =
    currentUser?.roles.some((role) =>
      [
        "FINANCE_MANAGER",
        "SUPPORT_AGENT",
        "ADMIN",
        "SUPER_ADMIN",
      ].includes(role)
    ) ?? false;

  const accountNavigation = currentUser
    ? [
        ...(canAccessScanner
          ? [
              {
                label: "Scanner",
                href: "/scanner",
              },
            ]
          : []),
        ...(canAccessAttendance
          ? [
              {
                label: "Attendance",
                href: "/operations/attendance",
              },
            ]
          : []),
        ...(canAccessEventManagement
          ? [
              {
                label: "Event Studio",
                href: "/operations/events",
              },
            ]
          : []),
        ...(canAccessOrderOperations
          ? [
              {
                label: "Order Ops",
                href: "/operations/orders",
              },
            ]
          : []),
        {
          label: "Orders",
          href: "/account/orders",
        },
        {
          label: "My Tickets",
          href: "/account/tickets",
        },
      ]
    : [
        {
          label:
            currentUser === undefined
              ? "Account"
              : "Sign in",
          href:
            currentUser === undefined
              ? "/account"
              : "/login",
        },
      ];

  return (
    <>
      <header
        className={`
          fixed
          inset-x-0
          top-0
          z-50
          border-b
          transition-all
          duration-500
          ${
            scrolled
              ? "border-white/10 bg-background/75 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }
        `}
      >
        <div className="lf-container flex h-20 items-center justify-between sm:h-24">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-[-0.04em] sm:text-xl"
          >
            LA FORESTA
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navigation.map(
              (item) => (
                <Link
                  key={
                    item.label
                  }
                  href={
                    item.href
                  }
                  className="font-technical text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {
                    item.label
                  }
                </Link>
              )
            )}

            {currentUser ? (
              <div className="group relative py-4">
                <Link
                  href="/account"
                  className="font-technical text-[10px] uppercase tracking-[0.16em] text-electric"
                >
                  Account
                </Link>

                <div className="pointer-events-none absolute right-0 top-full w-56 translate-y-2 border border-white/10 bg-background/95 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  {accountNavigation.map(
                    (item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block border-b border-white/10 px-3 py-3 font-technical text-[8px] uppercase tracking-[0.16em] text-muted-foreground transition-colors last:border-0 hover:text-electric"
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-between px-3 py-3 font-technical text-[8px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign out
                    <LogOut className="size-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href={
                  currentUser === undefined
                    ? "/account"
                    : "/login"
                }
                className="font-technical text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {currentUser === undefined
                  ? "Account"
                  : "Sign in"}
              </Link>
            )}

            <Link
              href="/events"
              className="border border-foreground/20 px-5 py-3 font-technical text-[10px] uppercase tracking-[0.18em] transition-all hover:border-electric hover:bg-electric hover:text-background"
            >
              Tickets
            </Link>
          </nav>

          <button
            type="button"
            onClick={() =>
              setMenuOpen(true)
            }
            className="flex size-10 items-center justify-center border border-white/10 transition-colors hover:border-electric sm:size-11 lg:hidden"
            aria-label="Open navigation"
            aria-expanded={
              menuOpen
            }
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                  }
            }
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration:
                reduceMotion
                  ? 0
                  : 0.25,
            }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-background"
          >
            <div className="lf-noise lf-grid pointer-events-none absolute inset-0 opacity-40" />

            <div className="lf-container relative z-10 flex h-20 items-center justify-between sm:h-24">
              <Link
                href="/"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
                className="font-display text-lg font-semibold tracking-[-0.04em] sm:text-xl"
              >
                LA FORESTA
              </Link>

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
                className="flex size-10 items-center justify-center border border-white/10 transition-colors hover:border-electric sm:size-11"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="lf-container relative z-10 flex min-h-[calc(100svh-5rem)] flex-col justify-center py-12 sm:min-h-[calc(100svh-6rem)]">
              <nav className="flex flex-col">
                {[...navigation, ...accountNavigation].map(
                  (
                    item,
                    index
                  ) => (
                    <motion.div
                      key={
                        item.label
                      }
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              y: 40,
                            }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          reduceMotion
                            ? 0
                            : index *
                              0.06,
                        duration:
                          reduceMotion
                            ? 0
                            : 0.55,
                      }}
                    >
                      <Link
                        href={
                          item.href
                        }
                        onClick={() =>
                          setMenuOpen(
                            false
                          )
                        }
                        className="block border-b border-white/10 py-4 font-display text-[clamp(2.5rem,10vw,5rem)] font-medium leading-none tracking-[-0.05em] transition-colors hover:text-electric"
                      >
                        {
                          item.label
                        }
                      </Link>
                    </motion.div>
                  )
                )}

                {currentUser && (
                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 20,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        reduceMotion
                          ? 0
                          : 0.28,
                      duration:
                        reduceMotion
                          ? 0
                          : 0.45,
                    }}
                    className="border-b border-white/10"
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between py-5 text-left font-display text-3xl tracking-[-0.04em]"
                    >
                      Sign out
                      <LogOut className="size-5 text-muted-foreground" />
                    </button>
                  </motion.div>
                )}
              </nav>

              <Link
                href="/events"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
                className="mt-10 flex h-14 items-center justify-center bg-electric font-technical text-[10px] uppercase tracking-[0.22em] text-background"
              >
                Get Tickets
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
