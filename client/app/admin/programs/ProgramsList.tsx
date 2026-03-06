"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Program } from "@pws/shared";
import { programsApi } from "../../../lib/api";
import toast from "react-hot-toast";
import { Edit3, Trash2, LayoutGrid } from "lucide-react";

interface ProgramsListProps {
  initialPrograms: Program[];
}

export default function ProgramsList({ initialPrograms }: ProgramsListProps) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/admin/programs/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        await programsApi.delete(id);
        setPrograms(programs.filter((program) => program.id !== id));
        toast.success("Program deleted successfully");
      } catch (error) {
        console.error("Error deleting program:", error);
        toast.error("Failed to delete program");
      }
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
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
            {programs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <LayoutGrid className="mb-2 h-8 w-8 opacity-20" />
                    <p>No programs found. Create one to get started!</p>
                  </div>
                </td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr
                  key={program.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">
                    {program.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {program.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        program.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {program.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(program.id)}
                      className="mr-3 inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                      title="Delete"
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
