"use client";

import { useEffect, useState } from "react";
import { Program, ProgramStatus } from "@pws/shared";
import ProgramGrid from "../../components/ProgramGrid";
import { programsApi } from "../../lib/api";
import { motion } from "framer-motion";

export default function ProgramsPage() {
  const [activePrograms, setActivePrograms] = useState<Program[]>([]);
  const [completedPrograms, setCompletedPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programsApi.getAll();

        // Filter into two arrays
        setActivePrograms(
          data.filter(
            (p: Program) =>
              p.status === ProgramStatus.ACTIVE ||
              p.status === ProgramStatus.PLANNED,
          ),
        );
        setCompletedPrograms(
          data.filter((p: Program) => p.status === ProgramStatus.COMPLETED),
        );
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 pt-28">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Our initiatives
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl">
            Building futures,
            <br className="hidden sm:block" />
            <span className="text-accent">one story at a time</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover programs designed with women's voices at the center. Each
            initiative is a step toward collective empowerment and lasting
            change.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex h-96 animate-pulse flex-col rounded-3xl bg-card border border-border"
              >
                <div className="h-48 w-full rounded-t-3xl bg-muted" />
                <div className="flex-1 p-6">
                  <div className="mb-4 h-4 w-1/4 rounded bg-muted" />
                  <div className="mb-2 h-6 w-3/4 rounded bg-muted" />
                  <div className="mb-4 h-4 w-full rounded bg-muted" />
                  <div className="mt-auto h-10 w-full rounded-xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-24">
            {/* Active Programs Section */}
            <section>
              <ProgramGrid programs={activePrograms} />
            </section>

            {/* Completed/Legacy Programs Section */}
            {completedPrograms.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="border-t border-border pt-16"
              >
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold text-primary">
                    Impact Archive
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Successfully completed initiatives and their lasting
                    legacies.
                  </p>
                </div>
                <ProgramGrid programs={completedPrograms} />
              </motion.section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
