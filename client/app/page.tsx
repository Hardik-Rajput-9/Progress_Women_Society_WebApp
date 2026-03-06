import CinematicHero from "../components/CinematicHero";
import HomeAnimatedSections from "../components/HomeAnimatedSections";
import { Program } from "@pws/shared";

// Next.js 14 Data Fetching (Server-Side)
async function getPrograms(): Promise<Program[]> {
  try {
    // Note: Use environment variables for the API URL in production
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/programs`,
      {
        next: { revalidate: 3600 }, // Cache and revalidate every hour for high performance
      },
    );

    if (!res.ok) {
      console.error("Failed to fetch programs, status:", res.status);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export default async function Home() {
  // 1. Fetch data on the server
  const programs = await getPrograms();
  const featured = programs.slice(0, 3);

  // 2. Render UI
  // The Hero is loaded immediately, while the interactive sections handle their own Framer Motion logic.
  return (
    <main className="w-full">
      <CinematicHero />
      <HomeAnimatedSections featuredPrograms={featured} />
    </main>
  );
}
