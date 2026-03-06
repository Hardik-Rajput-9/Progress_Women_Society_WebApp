"use client";

import { useState, use } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { volunteersApi } from "@/lib/api";

export default function JoinProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [role, setRole] = useState<"ENROLL" | "VOLUNTEER" | null>(null);

  const onSubmit = async (data: any) => {
    if (!role) return toast.error("Please select how you want to join.");

    const toastId = toast.loading("Submitting your application...");
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        skills: ["Program Enrollment"],
        role: role,
        programId: id,
      };

      await volunteersApi.create(payload as any);
      toast.success("Application submitted successfully!", { id: toastId });
      router.push(`/programs/${id}`);
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unknown error occurred.";
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage[0]
        : backendMessage;

      console.error("ACTUAL ERROR STRING:", errorMessage);
      console.error("FULL ERROR OBJECT:", error);

      toast.error(`Error: ${errorMessage}`, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <Link
          href={`/programs/${id}`}
          className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Program
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">
          Join This Program
        </h1>
        <p className="text-muted-foreground mb-8">
          Tell us how you'd like to be involved with this initiative.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 bg-card p-8 rounded-3xl border border-border shadow-sm"
        >
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setRole("ENROLL")}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${role === "ENROLL" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-primary">Enroll</h3>
                {role === "ENROLL" && (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                I want to participate as a beneficiary and receive
                support/training.
              </p>
            </div>

            <div
              onClick={() => setRole("VOLUNTEER")}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${role === "VOLUNTEER" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-primary">Volunteer</h3>
                {role === "VOLUNTEER" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                I want to help organize, teach, or support this program.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-primary">
                Full Name
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:border-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-primary">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-primary">
                  Phone
                </label>
                <input
                  {...register("phone", { required: true })}
                  className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-primary">
                Why do you want to join?
              </label>
              <textarea
                {...register("message")}
                rows={3}
                className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !role}
            className="w-full rounded-xl bg-accent py-4 font-bold text-accent-foreground shadow-lg hover:brightness-105 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
