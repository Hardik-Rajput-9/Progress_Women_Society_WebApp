import { useState, useEffect } from "react";
import {
  programsApi,
  donationsApi,
  volunteersApi,
  eventsApi,
} from "../lib/api";

export type ActivityItem = {
  id: string;
  type: "PROGRAM" | "DONATION" | "VOLUNTEER" | "EVENT";
  title: string;
  description: string;
  date: Date;
  link: string;
};

// extracts the Prisma Decimal object and adds commas
const formatAmount = (val: any) => {
  let num = 0;
  if (val !== null && val !== undefined) {
    if (typeof val === "object" && val.d && Array.isArray(val.d)) {
      num = Number(val.d.join(""));
    } else {
      num = Number(val);
    }
  }
  return isNaN(num) ? "0" : num.toLocaleString("en-IN");
};

export function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [programs, donations, volunteers, events] = await Promise.all([
          programsApi.getAll().catch(() => []),
          donationsApi.getAll().catch(() => []),
          volunteersApi.getAll().catch(() => []),
          eventsApi.getAll().catch(() => []),
        ]);

        const formattedActivities: ActivityItem[] = [
          ...programs.map(
            (p: any): ActivityItem => ({
              id: `prog-${p.id}`,
              type: "PROGRAM",
              title: "Program Updated",
              description: `"${p.name}" is now marked as ${p.status}.`,
              date: new Date(p.updatedAt || p.createdAt),
              link: `/admin/programs/edit/${p.id}`,
            }),
          ),
          ...donations.map(
            (d: any): ActivityItem => ({
              id: `don-${d.id}`,
              type: "DONATION",
              title: "Donation Received",
              description: `${d.isAnonymous ? "Anonymous" : d.donorName} contributed ₹${formatAmount(d.amount)}.`,
              date: new Date(d.createdAt),
              link: `/admin/donations`,
            }),
          ),
          ...volunteers.map(
            (v: any): ActivityItem => ({
              id: `vol-${v.id}`,
              type: "VOLUNTEER",
              title: "Volunteer Application",
              description: `${v.name} applied and is currently ${v.status}.`,
              date: new Date(v.createdAt),
              link: `/admin/volunteers`,
            }),
          ),
          ...events.map(
            (e: any): ActivityItem => ({
              id: `evt-${e.id}`,
              type: "EVENT",
              title: "Event Scheduled",
              description: `"${e.title}" is set for ${new Date(e.date).toLocaleDateString()}.`,
              date: new Date(e.updatedAt || e.createdAt),
              link: `/admin/events/edit/${e.id}`,
            }),
          ),
        ];

        // Sort by newest first
        formattedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
        setActivities(formattedActivities);
      } catch (error) {
        console.error("Failed to fetch activity feed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { activities, isLoading };
}
