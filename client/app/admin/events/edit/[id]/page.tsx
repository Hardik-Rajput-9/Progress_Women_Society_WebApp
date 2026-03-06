"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { eventsApi } from "@/lib/api";
import EventForm from "../../EventForm";
import { Loader2 } from "lucide-react";

export default function EditEventPage() {
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (id) {
      eventsApi.getById(id).then(setEvent).catch(console.error);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-primary">Edit Event</h1>
      <EventForm initialData={event} />
    </div>
  );
}
