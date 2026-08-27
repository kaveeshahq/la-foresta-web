"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Experience", href: "/#experience" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="lf-container flex h-24 items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-[-0.04em]"
          >
            LA FORESTA
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-technical text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/events"
              className="border border-foreground/20 px-5 py-3 font-technical text-[10px] uppercase tracking-[0.18em] transition-all hover:border-electric hover:bg-electric hover:text-background"
            >
              Tickets
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex size-11 items-center justify-center border border-white/10 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background"
          >
            <div className="lf-container flex h-24 items-center justify-between">
              <span className="font-display text-xl font-semibold">
                LA FORESTA
              </span>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex size-11 items-center justify-center border border-white/10"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="lf-container flex min-h-[calc(100vh-6rem)] flex-col justify-center">
              <nav className="flex flex-col">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.55,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-white/10 py-4 font-display text-[clamp(2.5rem,10vw,5rem)] font-medium leading-none tracking-[-0.05em]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}