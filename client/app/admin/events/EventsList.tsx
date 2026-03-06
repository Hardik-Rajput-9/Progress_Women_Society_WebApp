"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Edit3, Trash2, Calendar } from "lucide-react";
import { eventsApi } from "@/lib/api";

export default function EventsList({
  initialEvents,
}: {
  initialEvents: any[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const toastId = toast.loading("Deleting event...");
    try {
      await eventsApi.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete event", { id: toastId });
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-bold text-primary">No Events Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first community event.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Event Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {events.map((event) => (
              <tr
                key={event.id}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-bold text-primary">
                    {event.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {event.location}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-primary">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {event.timeString}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                      event.status === "UPCOMING"
                        ? "bg-accent/10 text-accent"
                        : event.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : event.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() =>
                      router.push(`/admin/events/edit/${event.id}`)
                    }
                    className="mr-3 inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
