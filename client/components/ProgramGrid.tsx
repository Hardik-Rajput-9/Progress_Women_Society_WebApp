"use client";

import { Program } from "@pws/shared";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";

export default function ProgramGrid({ programs }: { programs: Program[] }) {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0.05 : 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (programs.length === 0) {
    return (
      <motion.div
        className="col-span-full rounded-3xl border border-dashed border-border bg-background/50 px-6 py-16 text-center shadow-sm"
        initial="hidden"
        animate="visible"
        variants={item}
      >
        <svg
          className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p className="text-lg font-medium text-primary">
          No programs available right now
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check back soon for new community initiatives.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {programs.map((program) => (
        <motion.article
          key={program.id}
          variants={item}
          className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-background">
            {program.imageUrl ? (
              <Image
                src={program.imageUrl}
                alt={program.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/5">
                <svg
                  className="h-8 w-8 sm:h-12 sm:w-12 text-primary/20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
            )}
            <div className="absolute left-2 top-2 sm:left-4 sm:top-4">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold shadow-sm backdrop-blur-md ${program.status === "ACTIVE" ? "bg-accent/90 text-foreground" : "bg-card/90 text-card-foreground"}`}
              >
                {program.status}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-3 sm:p-6">
            <span className="mb-1 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-secondary line-clamp-1">
              {program.category || "Community"}
            </span>
            <h3 className="mb-1 sm:mb-3 text-sm sm:text-xl font-bold text-foreground transition-colors group-hover:text-secondary line-clamp-2">
              {program.name}
            </h3>
            <p className="mb-3 sm:mb-6 line-clamp-2 sm:line-clamp-3 flex-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {program.description}
            </p>

            <div className="mt-auto border-t border-border pt-3">
              <div className="flex items-center justify-between mb-3 text-[10px] sm:text-sm">
                <span className="font-semibold text-muted-foreground">
                  Budget:
                </span>
                <span className="font-bold text-primary">
                  ₹{program.budget?.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/programs/${program.id}`}
                  className="flex items-center justify-center rounded-lg bg-primary/10 py-2 text-[10px] sm:text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Details
                </Link>
                <Link
                  href={`/programs/${program.id}/join`}
                  className="flex items-center justify-center rounded-lg bg-accent/10 py-2 text-[10px] sm:text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  Join / Enroll
                </Link>
              </div>
              <Link
                href={`/donations?context=program&id=${program.id}&name=${encodeURIComponent(program.name)}`}
                className="mt-2 flex w-full items-center justify-center rounded-lg border border-border py-2 text-[10px] sm:text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Fund Cause
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
