"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { eventsApi } from "../../lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll();
        setEvents(data);
      } catch (error: any) {
        if (error?.response?.status !== 404)
          console.error("Failed to load events", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground pb-24">
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-primary/50 text-primary-foreground">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_right,#E5B94A,transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-accent"
          >
            Community In Action
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Join the Movement. <br />
            Experience the <span className="text-accent">Impact.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
          >
            From grassroots health camps to nationwide advocacy summits,
            discover where we are heading next and how you can be a part of it.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-3xl bg-card border border-border">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-primary">
              No events available right now
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon for upcoming gatherings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-32 sm:h-48 w-full overflow-hidden bg-muted">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/20">
                      <Calendar className="h-8 w-8 sm:h-12 sm:w-12" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 rounded-full bg-background/90 backdrop-blur-md px-2 py-0.5 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold text-primary shadow-sm">
                    {event.status}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3 sm:p-6">
                  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-semibold text-accent mb-1 sm:mb-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                    <span className="line-clamp-1">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-primary mb-1 sm:mb-2 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium text-muted-foreground mb-3 sm:mb-4">
                    <MapPin className="h-3 w-3" />{" "}
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <div className="mt-auto border-t border-border pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="flex items-center justify-center rounded-lg bg-primary/10 py-2 text-[10px] sm:text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/volunteers?context=event&id=${event.id}&name=${encodeURIComponent(event.title)}`}
                        className="flex items-center justify-center rounded-lg bg-accent/10 py-2 text-[10px] sm:text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white"
                      >
                        Register
                      </Link>
                    </div>
                    <Link
                      href={`/donations?context=event&id=${event.id}&name=${encodeURIComponent(event.title)}`}
                      className="mt-2 flex w-full items-center justify-center rounded-lg border border-border py-2 text-[10px] sm:text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      Fund Event
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
