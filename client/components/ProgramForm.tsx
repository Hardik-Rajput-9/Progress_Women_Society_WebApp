"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ProgramStatus } from "@pws/shared";
import { programsApi } from "../lib/api";
import toast from "react-hot-toast";
import { Save, X } from "lucide-react";

// The frontend representation of the Prisma ProgramCategory Enum
export enum ProgramCategory {
  SKILL_TRAINING = "SKILL_TRAINING",
  LEGAL_AID = "LEGAL_AID",
  HEALTH_CAMP = "HEALTH_CAMP",
  EDUCATION = "EDUCATION",
  RELIEF_DISTRIBUTION = "RELIEF_DISTRIBUTION",
  COMMUNITY_EMPOWERMENT = "COMMUNITY_EMPOWERMENT",
}

// Perfectly aligns with your create-program.dto.ts
export interface ProgramFormData {
  name: string;
  description: string;
  category: ProgramCategory;
  startDate: string;
  endDate?: string;
  status: ProgramStatus;
  targetBeneficiaries: number;
  location: string;
  budget: number;
  imageUrl?: string;
}

export default function ProgramForm({ program }: { program?: any }) {
  const router = useRouter();
  const isEdit = !!program;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormData>({
    defaultValues: program
      ? {
          name: program.name,
          description: program.description,
          category: program.category,
          // Format dates for HTML date inputs (YYYY-MM-DD)
          startDate: program.startDate
            ? new Date(program.startDate).toISOString().split("T")[0]
            : "",
          endDate: program.endDate
            ? new Date(program.endDate).toISOString().split("T")[0]
            : "",
          status: program.status,
          targetBeneficiaries: program.targetBeneficiaries,
          location: program.location,
          budget: program.budget,
          imageUrl: program.imageUrl || "",
        }
      : {
          name: "",
          description: "",
          category: ProgramCategory.EDUCATION,
          startDate: new Date().toISOString().split("T")[0],
          status: ProgramStatus.PLANNED,
          targetBeneficiaries: 0,
          location: "",
          budget: 0,
          imageUrl: "",
        },
  });

  const onSubmit = async (data: ProgramFormData) => {
    const toastId = toast.loading(
      isEdit ? "Updating program..." : "Creating program...",
    );
    try {
      // Ensure numeric fields are cast as numbers for the DTO
      const payload = {
        ...data,
        targetBeneficiaries: Number(data.targetBeneficiaries),
        budget: Number(data.budget),
        // If endDate is empty string, send undefined to bypass backend date validation errors
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
        startDate: new Date(data.startDate).toISOString(),
      };

      if (isEdit && program) {
        await programsApi.update(program.id, payload);
        toast.success("Program updated successfully!", { id: toastId });
      } else {
        await programsApi.create(payload as any);
        toast.success("Program created successfully!", { id: toastId });
      }
      router.push("/admin/programs");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error saving program:", err);
      toast.error("Failed to save program.", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Basic Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-primary">
            Program Name *
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-primary">
            Description *
          </label>
          <textarea
            rows={4}
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* 2. Classification & Status */}
      <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {Object.values(ProgramCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Status *
          </label>
          <select
            {...register("status")}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {Object.values(ProgramStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Logistics & Targets (The missing DTO fields) */}
      <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Location *
          </label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Target Beneficiaries *
          </label>
          <input
            type="number"
            {...register("targetBeneficiaries", {
              required: "Required",
              min: 1,
            })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Budget (INR) *
          </label>
          <input
            type="number"
            {...register("budget", { required: "Required", min: 0 })}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">
              Start Date *
            </label>
            <input
              type="date"
              {...register("startDate", { required: "Required" })}
              className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* 4. Media */}
      <div className="border-t border-border pt-6">
        <label className="mb-2 block text-sm font-semibold text-primary">
          Image URL (Optional)
        </label>
        <input
          type="url"
          {...register("imageUrl")}
          className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl bg-muted px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update Program"
              : "Create Program"}
        </button>
      </div>
    </form>
  );
}
