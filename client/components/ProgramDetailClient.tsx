"use client";

import Image from "next/image";
import Link from "next/link";
import { Program } from "@pws/shared";
import { motion, useReducedMotion, Variants } from "framer-motion";

export default function ProgramDetailClient({ program }: { program: Program }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground pt-24 pb-24">
      {/* Breadcrumb */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 text-sm font-medium text-muted-foreground lg:px-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/programs"
            className="hover:text-primary transition-colors"
          >
            Programs
          </Link>
          <span>/</span>
          <span className="text-primary truncate">{program.name}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative aspect-[21/9] min-h-[40vh] w-full overflow-hidden bg-primary">
          {program.imageUrl ? (
            <Image
              src={program.imageUrl}
              alt={program.name}
              fill
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-light/20 via-primary to-primary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative -mt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-3xl bg-card p-8 shadow-2xl md:p-12 border border-border"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              {/* Left: Content */}
              <div className="flex-1">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase ${
                      program.status === "ACTIVE"
                        ? "bg-accent/20 text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {program.status}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
                    {program.category || "Community Program"}
                  </span>
                </div>

                <h1 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl">
                  {program.name}
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl whitespace-pre-wrap">
                  {program.description}
                </p>
              </div>

              {/* Right: Action Card */}
              <div className="flex w-full flex-col gap-6 md:w-[320px] shrink-0">
                <div className="rounded-2xl bg-background p-6 border border-border shadow-inner">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary">
                    Program Overview
                  </h3>
                  <div className="mb-6 space-y-4">
                    <div className="flex justify-between border-b border-border/50 pb-3 text-sm">
                      <span className="text-muted-foreground">
                        Budget Requirement
                      </span>
                      <span className="font-bold text-primary">
                        ₹{program.budget?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-3 text-sm">
                      <span className="text-muted-foreground">
                        Target Reach
                      </span>
                      <span className="font-bold text-primary">
                        {program.targetBeneficiaries} lives
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {program.status !== "COMPLETED" && (
                      <Link
                        href={`/donations?amount=2500`}
                        className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 font-semibold text-accent-foreground shadow-md transition-all hover:brightness-95"
                      >
                        Fund this program
                      </Link>
                    )}
                    <Link
                      href={`/programs/${program.id}/join`}
                      className="flex w-full items-center justify-center rounded-xl border-2 border-primary bg-transparent px-4 py-3 font-semibold text-primary transition-all hover:bg-primary/50 hover:text-white"
                    >
                      Join / Enroll
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
