"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { programsApi, donationsApi } from "@/lib/api";
import { Program, Donation, DonationStatus } from "@pws/shared";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// extracts the Prisma Object directly into a pure Number
const extractAmountNum = (val: any): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && val.d && Array.isArray(val.d)) {
    return Number(val.d.join(""));
  }
  const parsed = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

const donationSchema = z.object({
  donorName: z.string().min(2, "Name must be at least 2 characters"),
  donorEmail: z.string().email("Please enter a valid email address"),
  amount: z.coerce.number().min(1, "Donation must be at least 1"),
  currency: z.string(),
  programId: z.string().optional(),
  isAnonymous: z.boolean(),
  message: z.string().optional(),
  status: z.nativeEnum(DonationStatus).optional(),
});

const checkoutSchema = donationSchema.omit({ status: true });
type DonationFormData = z.infer<typeof donationSchema>;

interface DonationFormProps {
  donation?: Donation;
  isEdit?: boolean;
  isAdmin?: boolean;
  prefilledAmount?: number | null;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
  interface RazorpayInstance {
    open: () => void;
    on: (event: "payment.failed", handler: (response: any) => void) => void;
  }
}

const loadRazorpay = () => {
  if (typeof window !== "undefined" && !window.Razorpay) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return true;
  }
  return false;
};

export default function DonationForm({
  donation,
  isEdit = false,
  isAdmin = false,
  prefilledAmount,
  onSuccess,
}: DonationFormProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const router = useRouter();

  const isEditMode = isEdit || !!donation?.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: donation
      ? {
          ...donation,
          amount: extractAmountNum(donation.amount),
          programId: donation.programId || "",
          message: donation.message || "",
        }
      : {
          donorName: "",
          donorEmail: "",
          amount: extractAmountNum(prefilledAmount),
          currency: "INR",
          programId: "",
          isAnonymous: false,
          message: "",
          status: DonationStatus.PENDING,
        },
  });

  useEffect(() => {
    if (prefilledAmount) {
      setValue("amount", extractAmountNum(prefilledAmount), {
        shouldValidate: true,
      });
    }
  }, [prefilledAmount, setValue]);

  useEffect(() => {
    loadRazorpay();
    const fetchPrograms = async () => {
      try {
        const data = await programsApi.getAll();
        setPrograms(
          data.filter((program: Program) => program.status === "ACTIVE"),
        );
      } catch (error) {
        console.error("Error loading programs:", error);
      }
    };
    fetchPrograms();
  }, []);

  const handleRazorpayPayment = async (
    data: DonationFormData,
    checkoutResponse: any,
  ) => {
    return new Promise<void>((resolve, reject) => {
      const options = {
        key: checkoutResponse.keyId,
        order_id: checkoutResponse.orderId,
        name: "Progress Women Society",
        description: "Empowering Lives, Restoring Hope",
        handler: async (response: any) => {
          try {
            await donationsApi.verifyPayment({
              orderId: checkoutResponse.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            reset();
            if (onSuccess) onSuccess();
            resolve();
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
            reject(error);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            reject(new Error("Payment cancelled by user"));
          },
        },
        prefill: { name: data.donorName, email: data.donorEmail },
        theme: { color: "#E5B94A" },
      };

      if (!window.Razorpay)
        return reject(new Error("Razorpay SDK failed to load"));
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", function () {
        toast.error("Payment failed. Please try again.");
        reject(new Error("Payment failed"));
      });
    });
  };

  const onSubmit = async (data: DonationFormData) => {
    const toastId = toast.loading(isEditMode ? "Updating..." : "Processing...");
    try {
      const cleanPayload: Record<string, any> = {
        amount: data.amount,
        donorName: data.donorName || "Manual Admin Entry",
        donorEmail: data.donorEmail || "offline@pws.org",
        currency: data.currency || "INR",
        isAnonymous: Boolean(data.isAnonymous),
      };

      if (data.message && data.message.trim() !== "")
        cleanPayload.message = data.message;
      if (data.programId && data.programId.trim() !== "")
        cleanPayload.programId = data.programId;

      if (isEditMode && donation) {
        cleanPayload.status = data.status || donation.status;
        await donationsApi.update(donation.id, cleanPayload);
        toast.success("Donation updated successfully", { id: toastId });
        router.push("/admin/donations");
        router.refresh();
      } else if (isAdmin) {
        cleanPayload.status = DonationStatus.COMPLETED;
        await donationsApi.create(cleanPayload as any);
        toast.success("Donation logged successfully", { id: toastId });
        router.push("/admin/donations");
        router.refresh();
      } else {
        const checkoutPayload = {
          ...cleanPayload,
          status: DonationStatus.PENDING,
        };
        const checkoutData = checkoutSchema.parse(checkoutPayload);
        const checkoutResponse = await donationsApi.checkout(checkoutData);
        toast.dismiss(toastId);
        await handleRazorpayPayment(checkoutPayload as any, checkoutResponse);
      }
    } catch (err: any) {
      console.log("🔥 NESTJS EXACT ERROR:", err.response?.data || err);
      let errorMsg = "Failed to process donation.";
      if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        errorMsg = Array.isArray(backendMsg)
          ? backendMsg.join(", ")
          : backendMsg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-primary">
            Amount (INR) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground font-semibold">
              ₹
            </span>
            <input
              {...register("amount")}
              type="number" // FIX: Reverted to type="number"
              min="1"
              step="any"
              className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 text-foreground shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={isSubmitting}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Full Name *
          </label>
          <input
            {...register("donorName")}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isSubmitting}
          />
          {errors.donorName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.donorName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">
            Email Address *
          </label>
          <input
            {...register("donorEmail")}
            type="email"
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isSubmitting}
          />
          {errors.donorEmail && (
            <p className="mt-1 text-xs text-red-500">
              {errors.donorEmail.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">
          Direct impact to a specific program (Optional)
        </label>
        <select
          {...register("programId")}
          className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          disabled={isSubmitting}
        >
          <option value="">General Fund (Allocated where most needed)</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center rounded-xl border border-border bg-background p-4 shadow-sm">
        <input
          {...register("isAnonymous")}
          id="isAnonymous"
          type="checkbox"
          className="h-5 w-5 rounded border-border text-accent focus:ring-accent"
          disabled={isSubmitting}
        />
        <label
          htmlFor="isAnonymous"
          className="ml-3 block text-sm font-medium text-foreground"
        >
          Keep my donation anonymous publicly
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">
          Message of support (Optional)
        </label>
        <textarea
          {...register("message")}
          rows={3}
          className="w-full rounded-xl border border-border bg-background p-3 text-foreground shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent py-4 text-base font-bold text-accent-foreground shadow-lg transition-all hover:scale-[1.02] hover:brightness-105 disabled:pointer-events-none disabled:opacity-70"
      >
        {isSubmitting
          ? "Processing..."
          : isEditMode
            ? "Save Changes"
            : isAdmin
              ? "Log Offline Donation"
              : "Complete Secure Checkout"}
      </button>
    </form>
  );
}
