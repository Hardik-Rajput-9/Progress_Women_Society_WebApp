"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Donation } from "@pws/shared";
import { donationsApi } from "../../../lib/api";
import toast from "react-hot-toast";
import { Edit3, Trash2, Wallet } from "lucide-react";

interface DonationsListProps {
  initialDonations: Donation[];
}

export default function DonationsList({
  initialDonations,
}: DonationsListProps) {
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const router = useRouter();

  const formatCurrency = (amount: any, currency: string) => {
    // FIX: Extracts the number safely even if it's a Prisma Decimal Object
    let num = 0;
    if (amount !== null && amount !== undefined) {
      if (typeof amount === "object" && amount.d && Array.isArray(amount.d)) {
        num = Number(amount.d.join(""));
      } else {
        num = Number(amount);
      }
    }

    if (isNaN(num)) num = 0;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation record?"))
      return;

    const toastId = toast.loading("Deleting donation...");
    try {
      await donationsApi.delete(id);
      setDonations((prev) => prev.filter((d) => d.id !== id));
      toast.success("Donation deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Failed to delete donation", { id: toastId });
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Donor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
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
            {donations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Wallet className="mb-2 h-8 w-8 opacity-20" />
                    <p>No donations found in the ledger.</p>
                  </div>
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr
                  key={donation.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-semibold text-primary">
                      {donation.isAnonymous
                        ? "Anonymous Donor"
                        : donation.donorName}
                    </div>
                    {!donation.isAnonymous && donation.donorEmail && (
                      <div className="text-xs text-muted-foreground">
                        {donation.donorEmail}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-primary">
                    {formatCurrency(donation.amount, donation.currency)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        donation.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : donation.status === "PENDING"
                            ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        router.push(`/admin/donations/edit/${donation.id}`)
                      }
                      className="mr-3 inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(donation.id)}
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
