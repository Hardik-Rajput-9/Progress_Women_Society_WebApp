"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { galleryApi } from "@/lib/api";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const gallerySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(2, "Category is required"),
  url: z.string().url("Must be a valid image URL"),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

export default function CreateGalleryImagePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
  });

  const onSubmit = async (data: GalleryFormData) => {
    const toastId = toast.loading("Adding image...");
    try {
      await galleryApi.create(data);
      toast.success("Image added successfully!", { id: toastId });
      router.push("/admin/gallery");
    } catch (error) {
      toast.error("Failed to add image.", { id: toastId });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">Add Gallery Image</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Image Title / Alt Text
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Community Tech Workshop"
            className="w-full rounded-xl border border-border bg-background p-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Category
          </label>
          <input
            {...register("category")}
            placeholder="e.g. Events, Programs, Impact"
            className="w-full rounded-xl border border-border bg-background p-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            This will automatically create a new filter tab on the public
            gallery page.
          </p>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Image URL
          </label>
          <input
            {...register("url")}
            placeholder="https://..."
            className="w-full rounded-xl border border-border bg-background p-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            disabled={isSubmitting}
          />
          {errors.url && (
            <p className="mt-1 text-xs text-red-500">{errors.url.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent py-4 font-bold text-accent-foreground shadow-lg transition-all hover:brightness-105 disabled:opacity-70"
        >
          {isSubmitting ? "Uploading..." : "Add to Gallery"}
        </button>
      </form>
    </div>
  );
}
