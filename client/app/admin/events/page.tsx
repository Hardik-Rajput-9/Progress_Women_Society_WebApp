"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, Loader2 } from "lucide-react";
import EventsList from "./EventsList";
import { eventsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll();
        setEvents(data);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setEvents([]);
        } else {
          console.error("Failed to fetch events:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-card border border-border p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <Calendar className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
              Manage Events
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule, update, or cancel community gatherings.
            </p>
          </div>
        </div>
        <Link
          href="/admin/events/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5" />
          Create Event
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <EventsList initialEvents={events} />
      )}
    </div>
  );
}
