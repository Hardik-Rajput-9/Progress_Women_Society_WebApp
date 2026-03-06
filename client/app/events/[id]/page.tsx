"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  Users,
  Heart,
} from "lucide-react";
import { eventsApi } from "@/lib/api";

export default function EventDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      eventsApi
        .getById(params.id as string)
        .then(setEvent)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [params.id]);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  if (!event)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-bold">
        Event not found.
      </div>
    );

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-primary overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1A15_0%,#050D0A_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="mx-auto max-w-5xl">
            <span className="inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground mb-4">
              {event.status}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 drop-shadow-lg">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />{" "}
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" /> {event.timeString}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> {event.location}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content & Actions */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="prose prose-lg dark:prose-invert">
          <h2 className="text-2xl font-bold text-primary mb-4">
            About This Event
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        {/* Floating Action Box */}
        <div className="sticky top-28 h-fit rounded-3xl border border-border bg-card p-6 shadow-xl">
          <h3 className="text-lg font-bold text-primary mb-4">Take Action</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Join us to make this event a success. You can register to attend or
            fund the logistics.
          </p>

          <div className="space-y-3">
            <Link
              href={`/volunteers?context=event&id=${event.id}&name=${encodeURIComponent(event.title)}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-4 text-sm font-bold text-accent-foreground shadow-md transition-all hover:scale-105"
            >
              <Users className="h-5 w-5" /> Register / Volunteer
            </Link>
            <Link
              href={`/donations?context=event&id=${event.id}&name=${encodeURIComponent(event.title)}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent py-3.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <Heart className="h-5 w-5" /> Fund This Event
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
