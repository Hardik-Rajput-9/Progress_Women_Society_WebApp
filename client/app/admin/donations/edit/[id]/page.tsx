"use client";

import { useEffect, useState, use } from "react";
import { Donation } from "@pws/shared";
import DonationForm from "../../../../../components/DonationForm";
import { Loader2, HeartHandshake, AlertCircle } from "lucide-react";

export default function EditDonationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("pws_token")
            : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/donations/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          },
        );

        if (res.ok) setDonation(await res.json());
      } catch (error) {
        console.error(`Error fetching donation with id: ${id}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 p-12 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-red-500">Donation Not Found</h2>
        <p className="mt-2 text-sm text-red-500/80">
          The requested record does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
          <HeartHandshake className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Edit Donation:{" "}
            {donation.isAnonymous ? "Anonymous" : donation.donorName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update ledger details for this contribution.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <DonationForm donation={donation} isAdmin={true} isEdit={true} />
      </div>
    </div>
  );
}
