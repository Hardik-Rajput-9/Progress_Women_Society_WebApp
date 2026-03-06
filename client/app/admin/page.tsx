"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
  ArrowRight,
  Loader2,
  Megaphone,
  IndianRupeeIcon,
  FileText,
  ImageIcon,
} from "lucide-react";
import { useActivityFeed } from "@/hooks/useActivityFeed";

export const dynamic = "force-dynamic";

// --- DYNAMIC ACTIVITY FEED WIDGET ---
function DynamicActivityFeed() {
  const { activities, isLoading } = useActivityFeed();

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No recent activity found.
      </div>
    );
  }

  // UPDATED: Added EVENT type
  const getIcon = (type: string) => {
    if (type === "PROGRAM")
      return <Calendar className="h-4 w-4 text-secondary" />;
    if (type === "DONATION")
      return <DollarSign className="h-4 w-4 text-primary" />;
    if (type === "EVENT")
      return <Megaphone className="h-4 w-4 text-orange-500" />;
    return <Users className="h-4 w-4 text-accent" />;
  };

  // UPDATED: Added EVENT color mapping
  const getBgColor = (type: string) => {
    if (type === "PROGRAM") return "bg-secondary/10";
    if (type === "DONATION") return "bg-primary/10";
    if (type === "EVENT") return "bg-orange-500/10";
    return "bg-accent/20";
  };

  return (
    <div className="space-y-4 pr-2 max-h-[400px] overflow-y-auto">
      {activities.slice(0, 5).map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="flex items-start gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:border-accent hover:shadow-md"
        >
          <div
            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getBgColor(item.type)}`}
          >
            {getIcon(item.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
              {item.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {item.description}
            </p>
            <p className="mt-2 text-xs font-semibold text-secondary">
              {item.date.toLocaleDateString()} •{" "}
              {item.date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalDonations: 0,
    activeVolunteers: 0,
    totalEvents: 0, // Added totalEvents mapping
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("pws_token")
            : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/dashboard/stats`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          },
        );
        if (res.ok) setStats(await res.json());
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const statCards = [
    {
      key: "totalPrograms",
      label: "Programs",
      icon: Calendar,
      value: stats.totalPrograms,
      suffix: "Active initiatives",
      href: "/admin/programs",
    },
    {
      key: "totalEvents",
      label: "Events",
      icon: Megaphone,
      value: stats.totalEvents || 0,
      suffix: "Upcoming gatherings",
      href: "/admin/events",
    },
    {
      key: "activeVolunteers",
      label: "Volunteers",
      icon: Users,
      value: stats.activeVolunteers,
      suffix: "Active members",
      href: "/admin/volunteers",
    },
    {
      key: "totalDonations",
      label: "Donations",
      icon: IndianRupeeIcon,
      value: `₹${stats.totalDonations.toLocaleString()}`,
      suffix: "Funds tracked",
      href: "/admin/donations",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Welcome Header */}
      <motion.div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary p-6 sm:p-10 text-primary-foreground shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative z-10">
          <motion.div className="mb-2 sm:mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
              Dashboard Overview
            </h1>
          </motion.div>
          <motion.p className="text-sm sm:text-lg text-primary-foreground/80 max-w-2xl">
            Welcome to mission control. Monitor your community impact, track
            incoming funds, and deploy resources effectively.
          </motion.p>
        </div>
      </motion.div>

      {/* Responsive Metrics Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.key}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={card.href}
              className="group relative block h-full rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/50"
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <card.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-sm font-medium uppercase tracking-wider text-muted-foreground line-clamp-1">
                  {card.label}
                </p>
                <div className="text-xl sm:text-3xl font-bold tracking-tight text-primary truncate">
                  {isLoading ? (
                    <div className="h-6 w-16 sm:h-9 sm:w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent" />
                <p className="text-[9px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
                  {card.suffix}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Workspace Area */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Quick Actions */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
            Workspace Actions
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                title: "Manage Events",
                desc: "Schedule community gatherings.",
                href: "/admin/events",
                icon: Megaphone,
              },
              {
                title: "Launch Program",
                desc: "Create and publish an initiative.",
                href: "/admin/programs/create",
                icon: Calendar,
              },
              {
                title: "Manual Donation",
                desc: "Log offline financial records.",
                href: "/admin/donations/create",
                icon: DollarSign,
              },
              {
                title: "Review Volunteers",
                desc: "Process pending applications.",
                href: "/admin/volunteers",
                icon: Users,
              },
              {
                title: "Manage Blog",
                desc: "Write and publish updates.",
                href: "/admin/blog",
                icon: FileText,
              },
              {
                title: "Manage Gallery",
                desc: "Upload community photos.",
                href: "/admin/gallery",
                icon: ImageIcon,
              },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-accent hover:shadow-md"
              >
                <div>
                  <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-primary/5 p-2 sm:p-3 text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-1 text-sm sm:text-base font-bold text-primary">
                    {action.title}
                  </h3>
                  <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-2">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 flex items-center text-xs sm:text-sm font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Access <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Live Activity Widget */}
        <motion.div
          className="flex flex-col rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-5 sm:mb-6 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary">
              Live Activity
            </h2>
          </div>

          <DynamicActivityFeed />

          <Link
            href="/admin/activity"
            className="mt-6 block w-full rounded-xl border border-border bg-background py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
          >
            View Full Audit Log
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
