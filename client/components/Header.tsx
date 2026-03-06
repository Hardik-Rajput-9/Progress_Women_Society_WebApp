"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import { programsApi } from "@/lib/api";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("lucide-react").then((mod) => mod.Menu), {
  ssr: false,
});
const X = dynamic(() => import("lucide-react").then((mod) => mod.X), {
  ssr: false,
});
const Sun = dynamic(() => import("lucide-react").then((mod) => mod.Sun), {
  ssr: false,
});
const Moon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), {
  ssr: false,
});
const ChevronDown = dynamic(
  () => import("lucide-react").then((mod) => mod.ChevronDown),
  { ssr: false },
);

// FIXED: Removed "Events" from this dropdown menu
const moreLinks = [
  { name: "Gallery", path: "/gallery" },
  { name: "Blog & Updates", path: "/blog" },
  { name: "Contact Us", path: "/contact" },
];

const fetcher = async () => {
  try {
    const data = await programsApi.getAll();
    return data
      .filter((p: any) => p.status === "ACTIVE" || p.status === "PLANNED")
      .slice(0, 4);
  } catch (error) {
    return []; // Graceful fallback if database is down
  }
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const { data: activePrograms } = useSWR("header-programs", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xl group-hover:scale-105 transition-transform">
            <img
              src="/assets/images/logo.svg"
              alt="PWS Logo"
              className="h-auto w-auto"
              width="40"
              height="40"
            />
          </div>
          <span className="font-bold tracking-tight text-primary text-xl hidden sm:block">
            Progress Women Society
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-accent ${pathname === "/about" ? "text-accent" : "text-primary"}`}
          >
            About
          </Link>

          {/* Programs Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("programs")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent py-2 ${pathname?.startsWith("/programs") ? "text-accent" : "text-primary"}`}
            >
              Programs{" "}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${activeDropdown === "programs" ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "programs" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-64 rounded-2xl border border-border bg-background/95 backdrop-blur-md p-2 shadow-xl"
                >
                  <Link
                    href="/programs"
                    className="block rounded-xl px-4 py-2.5 text-sm font-bold text-accent mb-1 border-b border-border/50 pb-3 transition-colors hover:bg-accent/10"
                  >
                    All Programs →
                  </Link>
                  {activePrograms?.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/programs/${p.id}`}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors line-clamp-1"
                    >
                      {p.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Standalone Events Link */}
          <Link
            href="/events"
            className={`text-sm font-medium transition-colors hover:text-accent ${pathname === "/events" ? "text-accent" : "text-primary"}`}
          >
            Events
          </Link>

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("more")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors py-2">
              More{" "}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${activeDropdown === "more" ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "more" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-48 rounded-2xl border border-border bg-background/95 backdrop-blur-md p-2 shadow-xl"
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.path}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
          {mounted && user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-bold text-accent hover:brightness-110 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
          <Link
            href="/volunteers"
            className="text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            Volunteer
          </Link>
          <Link
            href="/donations"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-95 shadow-sm"
          >
            Donate
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-primary"
          >
            {mounted && theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col px-6 py-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-primary"
              >
                About
              </Link>
              <Link
                href="/programs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-primary"
              >
                All Programs
              </Link>

              {/* FIXED: Added Events explicitly to Mobile Menu */}
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-primary"
              >
                Events
              </Link>

              {moreLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-primary"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-border my-4" />

              {mounted && user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-accent"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/volunteers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-primary"
              >
                Volunteer
              </Link>
              <Link
                href="/donations"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl bg-accent p-4 text-center font-bold text-accent-foreground shadow-sm"
              >
                Donate Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
