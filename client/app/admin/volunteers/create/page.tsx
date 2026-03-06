"use client";

import VolunteerForm from "../../../../components/VolunteerForm";
import { Users } from "lucide-react";

export default function CreateVolunteerPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Add Volunteer</h1>
          <p className="text-sm text-muted-foreground">
            Manually onboard a new team member.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <VolunteerForm isAdmin />
      </div>
    </div>
  );
}
