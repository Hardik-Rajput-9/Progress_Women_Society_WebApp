"use client";

import { useEffect, useState, use } from "react";
import { Volunteer } from "@pws/shared";
import VolunteerForm from "../../../../../components/VolunteerForm";
import { Loader2, Users, AlertCircle } from "lucide-react";

export default function EditVolunteerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("pws_token")
            : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/volunteers/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          },
        );

        if (res.ok) setVolunteer(await res.json());
      } catch (error) {
        console.error(`Error fetching volunteer with id: ${id}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVolunteer();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 p-12 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-red-500">Volunteer Not Found</h2>
        <p className="mt-2 text-sm text-red-500/80">
          The requested application does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Edit Volunteer: {volunteer.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update applicant details or assignment status.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <VolunteerForm volunteer={volunteer} isAdmin />
      </div>
    </div>
  );
}
