"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Volunteer, VolunteerStatus } from "@pws/shared";
import { volunteersApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Trash2,
  UserPlus,
  Loader2,
  GraduationCap,
  UserCheck,
} from "lucide-react";

export default function VolunteersList({
  initialVolunteers,
}: {
  initialVolunteers: Volunteer[];
}) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  // Direct Inline Status Update
  const handleStatusChange = async (id: string, newStatus: VolunteerStatus) => {
    setUpdatingId(id);
    const toastId = toast.loading("Updating status...");
    try {
      await volunteersApi.update(id, { status: newStatus } as any);
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)),
      );
      toast.success("Status updated", { id: toastId });
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently remove this application?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await volunteersApi.delete(id);
      setVolunteers((prev) => prev.filter((v) => v.id !== id));
      toast.success("Deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Applicant
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {volunteers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserPlus className="mb-2 h-8 w-8 opacity-20" />
                    <p>No applications found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              volunteers.map((v: any) => (
                <tr key={v.id} className="transition-colors hover:bg-muted/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-primary">
                        {v.name}
                      </div>
                      {/* Role Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          v.role === "ENROLL"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {v.role === "ENROLL" ? (
                          <GraduationCap className="w-3 h-3" />
                        ) : (
                          <UserCheck className="w-3 h-3" />
                        )}
                        {v.role || "VOLUNTEER"}
                      </span>
                    </div>

                    {/* NEW: Display the Program Name if it exists! */}
                    {v.program?.name && (
                      <div className="mt-1.5 inline-block rounded-md border border-accent/20 bg-accent/5 px-2 py-1 text-xs font-bold text-accent">
                        Program: {v.program.name}
                      </div>
                    )}

                    {/* Safe optional chaining for availability */}
                    <div className="text-xs text-muted-foreground mt-1.5">
                      Avail: {v.availability?.replace(/_/g, " ") || "N/A"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-primary">{v.email}</div>
                    {v.phone && (
                      <div className="text-xs text-muted-foreground">
                        {v.phone}
                      </div>
                    )}
                  </td>

                  {/* DIRECT INLINE STATUS DROPDOWN */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="relative inline-flex items-center">
                      <select
                        value={v.status}
                        onChange={(e) =>
                          handleStatusChange(
                            v.id,
                            e.target.value as VolunteerStatus,
                          )
                        }
                        disabled={updatingId === v.id}
                        className={`appearance-none cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold shadow-sm border border-border outline-none transition-colors ${
                          v.status === "ACTIVE"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : v.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                              : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACTIVE">APPROVED</option>
                        <option value="INACTIVE">REJECTED</option>
                      </select>
                      {updatingId === v.id && (
                        <Loader2 className="absolute -right-6 h-4 w-4 animate-spin text-accent" />
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                      title="Delete Permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
