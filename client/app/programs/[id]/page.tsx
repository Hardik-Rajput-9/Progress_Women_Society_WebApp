import { Program } from "@pws/shared";
import { notFound } from "next/navigation";
import ProgramDetailClient from "../../../components/ProgramDetailClient";

export const revalidate = 3600;

async function getProgram(id: string): Promise<Program | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/programs/${id}`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching program:", error);
    return null;
  }
}

// In Next.js 14, params is a Promise that must be awaited
export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const program = await getProgram(resolvedParams.id);

  if (!program) {
    notFound(); // Triggers Next.js 404 page automatically
  }

  return <ProgramDetailClient program={program} />;
}
