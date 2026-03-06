"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Donation } from "@pws/shared";
import DonationsList from "./DonationsList";
import { HeartHandshake, Plus, Loader2 } from "lucide-react";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("pws_token")
            : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/donations`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          },
        );

        if (res.ok) {
          setDonations(await res.json());
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Donation Ledger</h1>
            <p className="text-sm text-muted-foreground">
              Track incoming contributions and CSR funds.
            </p>
          </div>
        </div>
        <Link
          href="/admin/donations/create"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" /> Manual Entry
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <DonationsList initialDonations={donations} />
      )}
    </div>
  );
}
