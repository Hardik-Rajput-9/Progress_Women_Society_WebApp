"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Program } from "@pws/shared";
import ProgramsList from "./ProgramsList";
import { FolderKanban, Plus, Loader2 } from "lucide-react";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("pws_token")
            : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/programs`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          },
        );

        if (res.ok) {
          setPrograms(await res.json());
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderKanban className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Programs</h1>
            <p className="text-sm text-muted-foreground">
              Manage and update your active initiatives.
            </p>
          </div>
        </div>
        <Link
          href="/admin/programs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" /> New Program
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <ProgramsList initialPrograms={programs} />
      )}
    </div>
  );
}
