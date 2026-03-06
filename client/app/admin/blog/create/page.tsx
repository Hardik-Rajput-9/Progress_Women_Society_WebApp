"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { postsApi } from "@/lib/api";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt is required"),
  content: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  imageUrl: z.string().url("Must be a valid image URL"),
  author: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    const toastId = toast.loading("Publishing post...");
    try {
      await postsApi.create(data);
      toast.success("Post published successfully!", { id: toastId });
      router.push("/admin/blog");
    } catch (error) {
      toast.error("Failed to publish post.", { id: toastId });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">Create New Blog Post</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Title
          </label>
          <input
            {...register("title")}
            className="w-full rounded-xl border border-border bg-background p-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">
              Category
            </label>
            <input
              {...register("category")}
              placeholder="e.g. Education"
              className="w-full rounded-xl border border-border bg-background p-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              disabled={isSubmitting}
            />
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
              {...register("imageUrl")}
              placeholder="https://..."
              className="w-full rounded-xl border border-border bg-background p-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              disabled={isSubmitting}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-red-500">
                {errors.imageUrl.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Short Excerpt
          </label>
          <textarea
            {...register("excerpt")}
            rows={2}
            className="w-full rounded-xl border border-border bg-background p-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            disabled={isSubmitting}
          />
          {errors.excerpt && (
            <p className="mt-1 text-xs text-red-500">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent py-4 font-bold text-accent-foreground shadow-lg hover:brightness-105 disabled:opacity-70"
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
