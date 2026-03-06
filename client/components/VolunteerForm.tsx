"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { volunteersApi } from "../lib/api";
import { Volunteer, VolunteerAvailability, VolunteerStatus } from "@pws/shared";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export type VolunteerFormData = Omit<Volunteer, "id" | "joinedDate"> & {
  joinedDate?: string;
};

interface VolunteerFormProps {
  volunteer?: Volunteer;
  isAdmin?: boolean;
  onSuccess?: () => void;
}

export default function VolunteerForm({
  volunteer,
  isAdmin = false,
  onSuccess,
}: VolunteerFormProps) {
  const router = useRouter();
  const isEdit = !!volunteer;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormData>({
    defaultValues: volunteer
      ? {
          ...volunteer,
          joinedDate: new Date(volunteer.joinedDate)
            .toISOString()
            .split("T")[0],
        }
      : {
          name: "",
          email: "",
          phone: "",
          skills: [],
          interests: [],
          availability: VolunteerAvailability.FLEXIBLE,
          status: VolunteerStatus.PENDING,
          joinedDate: new Date().toISOString().split("T")[0],
        },
  });

  const onSubmit = async (data: VolunteerFormData) => {
    const toastId = toast.loading(
      isEdit ? "Updating record..." : "Submitting application...",
    );
    try {
      // STRICT PAYLOAD CLEANING: Only send what the backend expects
      const submissionData: any = {
        name: data.name,
        email: data.email,
        availability: data.availability,
        skills: data.skills || [],
        interests: data.interests || [],
      };

      // Only attach phone if it actually exists (prevents empty string errors)
      if (data.phone) submissionData.phone = data.phone;

      if (isEdit && volunteer) {
        // If Admin is editing, they are allowed to update the status
        submissionData.status = data.status;
        await volunteersApi.update(volunteer.id, submissionData);
        toast.success("Saved successfully", { id: toastId });
      } else {
        // Public creation - Backend will automatically set status to PENDING
        await volunteersApi.create(submissionData);
        toast.success("Application received! We will review it shortly.", {
          id: toastId,
        });
      }

      if (isAdmin) {
        router.push("/admin/volunteers");
        router.refresh();
      } else if (onSuccess) {
        onSuccess();
        reset();
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error saving record", {
        id: toastId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Full Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Please enter name" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Please enter email" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-primary">
            Phone (Optional)
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="grid gap-8 border-t border-border pt-6 md:grid-cols-2">
        <div>
          <label className="mb-3 block text-sm font-semibold text-primary">
            Core Skills
          </label>
          <div className="grid grid-cols-2 gap-3 text-sm text-foreground">
            {["Teaching", "Marketing", "Event Planning", "Technology"].map(
              (skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={skill}
                    {...register("skills")}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  {skill}
                </label>
              ),
            )}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-primary">
            Areas of Interest
          </label>
          <div className="grid grid-cols-2 gap-3 text-sm text-foreground">
            {["Education", "Healthcare", "Legal Aid", "Fundraising"].map(
              (interest) => (
                <label
                  key={interest}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={interest}
                    {...register("interests")}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  {interest}
                </label>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Availability
          </label>
          <select
            {...register("availability")}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {Object.values(VolunteerAvailability).map((v) => (
              <option key={v} value={v}>
                {v.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* ONLY Admin can see and change the Application Status */}
        {isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">
              Application Status
            </label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {Object.values(VolunteerStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.01] disabled:opacity-70"
        >
          <Save className="h-5 w-5" />
          {isSubmitting
            ? "Processing..."
            : isEdit
              ? "Update Volunteer Record"
              : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
