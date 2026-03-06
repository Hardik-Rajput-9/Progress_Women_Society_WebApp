"use client";

import { useState } from "react";
import { useActivityFeed, ActivityItem } from "../../../hooks/useActivityFeed";
import {
  Users,
  DollarSign,
  Calendar,
  Loader2,
  ExternalLink,
  Megaphone,
  Filter,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";

export default function ActivityLogPage() {
  const { activities, isLoading } = useActivityFeed();
  const [filter, setFilter] = useState<string>("ALL");

  const filteredActivities =
    filter === "ALL" ? activities : activities.filter((a) => a.type === filter);

  // UPDATED: Now handles the EVENT type
  const getIcon = (type: string) => {
    switch (type) {
      case "PROGRAM":
        return <Calendar className="h-5 w-5 text-secondary" />;
      case "DONATION":
        return <DollarSign className="h-5 w-5 text-primary" />;
      case "EVENT":
        return <Megaphone className="h-5 w-5 text-orange-500" />;
      default:
        return <Users className="h-5 w-5 text-accent" />;
    }
  };

  // UPDATED: Now handles the EVENT type colors
  const getBgColor = (type: string) => {
    switch (type) {
      case "PROGRAM":
        return "bg-secondary/10";
      case "DONATION":
        return "bg-primary/10";
      case "EVENT":
        return "bg-orange-500/10";
      default:
        return "bg-accent/20";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary shrink-0">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Platform Audit Log
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A complete chronological history of all database interactions and
            community activities.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-2 mr-2 text-muted-foreground px-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Filter:
          </span>
        </div>
        {["ALL", "DONATION", "EVENT", "PROGRAM", "VOLUNTEER"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold transition-all ${
              filter === type
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-background text-muted-foreground border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Activity className="mb-4 h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-bold text-primary">
              No Activity Found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((item: ActivityItem, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.link}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 sm:p-5 transition-all hover:border-accent hover:shadow-md"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div
                        className={`mt-1 sm:mt-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getBgColor(item.type)}`}
                      >
                        {getIcon(item.type)}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-primary group-hover:text-accent transition-colors">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                      <p className="text-xs font-semibold text-secondary">
                        {item.date.toLocaleDateString()} •{" "}
                        {item.date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="inline-flex items-center text-xs font-bold text-muted-foreground group-hover:text-accent transition-colors sm:mt-1">
                        View Record <ExternalLink className="ml-1 h-3 w-3" />
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
