"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { eventsApi } from "@/lib/api";
import {
  Save,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  timeString: string;
  location: string;
  imageUrl?: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
}

interface EventFormProps {
  initialData?: EventFormData & { id: string };
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date).toISOString().split("T")[0],
        }
      : {
          title: "",
          description: "",
          date: "",
          timeString: "",
          location: "",
          imageUrl: "",
          status: "UPCOMING",
        },
  });

  const onSubmit = async (data: any) => {
    const toastId = toast.loading(
      isEdit ? "Updating event..." : "Creating event...",
    );
    try {
      const payload = {
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
        timeString: data.timeString,
        location: data.location,
        imageUrl: data.imageUrl || undefined,
        status: data.status,
      };

      if (isEdit && initialData) {
        await eventsApi.update(initialData.id, payload);
        toast.success("Event updated successfully", { id: toastId });
      } else {
        await eventsApi.create(payload);
        toast.success("Event created successfully", { id: toastId });
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      console.error("Form Submit Error:", err.response?.data);
      toast.error(
        err.response?.data?.message || "Failed to save event. Check console.",
        { id: toastId },
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-primary">
            Event Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="e.g. Annual Women's Leadership Summit"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarIcon className="h-4 w-4" /> Date
          </label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Clock className="h-4 w-4" /> Time String
          </label>
          <input
            {...register("timeString", { required: "Time is required" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="e.g. 10:00 AM - 4:00 PM"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="h-4 w-4" /> Location
          </label>
          <input
            {...register("location", { required: "Location is required" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="e.g. New Delhi Community Center or 'Online'"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-primary">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-background p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="Describe the event details, speakers, and goals..."
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <ImageIcon className="h-4 w-4" /> Cover Image URL
          </label>
          <input
            {...register("imageUrl")}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="UPCOMING">UPCOMING</option>
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border mt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="mr-4 px-6 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02] disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update Event"
              : "Create Event"}
        </button>
      </div>
    </form>
  );
}
