"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authApi } from "../../lib/api";
import { AuthGuard } from "../../components/AuthGuard";
import {
  LayoutDashboard,
  FolderKanban,
  HeartHandshake,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
  Images,
  BookOpen,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Programs", path: "/admin/programs", icon: FolderKanban },
  { name: "Donations", path: "/admin/donations", icon: HeartHandshake },
  { name: "Volunteers", path: "/admin/volunteers", icon: Users },
  { name: "Events", path: "/admin/events", icon: Calendar },
  { name: "Gallery", path: "/admin/gallery", icon: Images },
  { name: "Blog and Posts", path: "/admin/blog", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    window.location.href = "/login"; //force a hard React state reset
  };

  return (
    // Wrap the entire layout in AuthGuard to secure ALL admin routes instantly
    <AuthGuard roles={["ADMIN"]}>
      <div className="flex h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="flex h-20 items-center justify-between border-b border-border px-6">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xl group-hover:scale-105 transition-transform">
                  <img
                    src="/assets/images/logo.svg"
                    alt="PWS Logo"
                    className="h-auto w-auto"
                    width="40"
                    height="40"
                  />
                </div>

                <span className="font-bold tracking-tight text-primary text-xl">
                  PWS Admin
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden text-muted-foreground hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.path ||
                  pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? "text-accent"
                          : "text-muted-foreground group-hover:text-primary"
                      }
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User & Logout Section */}
            <div className="border-t border-border p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400"
              >
                <LogOut size={20} />
                Secure Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Header Bar */}
          <header className="flex h-20 items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-primary/5 hover:text-primary lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-primary hidden sm:block">
                Dashboard Overview
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* 1. View Public Site Button */}
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
              >
                View Site <ExternalLink className="h-4 w-4" />
              </Link>

              {/* 2. Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors hover:bg-primary/10"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Admin Profile Display */}
            <div className="flex items-center gap-3 border-l border-border pl-4 sm:pl-6">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-primary">System Admin</p>
                <p className="text-xs font-medium text-secondary">
                  Full Access
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-background">
                SA
              </div>
            </div>
          </header>

          {/* Page Content Rendering Area */}
          <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
