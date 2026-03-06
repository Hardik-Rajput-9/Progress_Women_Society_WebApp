"use client";

import DonationForm from "../../../../components/DonationForm";
import { HeartHandshake } from "lucide-react";

export default function CreateDonationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
          <HeartHandshake className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Record New Donation
          </h1>
          <p className="text-sm text-muted-foreground">
            Manually enter a donation into the system ledger.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <DonationForm isAdmin />
      </div>
    </div>
  );
}
