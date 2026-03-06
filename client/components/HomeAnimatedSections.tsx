"use client";

import Link from "next/link";
import { Program } from "@pws/shared";
import { motion, useReducedMotion, Variants, Transition } from "framer-motion";
import { useCountUp } from "../lib/hooks/useCountUp";

// Data
const impactCounters = [
  {
    label: "Lives impacted",
    value: 18400,
    detail: "People reached with education & aid",
  },
  {
    label: "Courses delivered",
    value: 320,
    detail: "Skill & empowerment programs",
  },
  {
    label: "Camps & drives",
    value: 124,
    detail: "Health, awareness & essentials distribution",
  },
];

const transparencyData = [
  { label: "Programs", value: "62%" },
  { label: "Capacity Building", value: "23%" },
  { label: "Operations", value: "11%" },
  { label: "Future Fund", value: "4%" },
];

const testimonials = [
  {
    name: "Asha",
    role: "Entrepreneur",
    quote:
      "Before Progress Women Society, I had ideas but no way to start. Today I run a small tailoring unit.",
  },
  {
    name: "Farah",
    role: "Graduate",
    quote:
      "I wrote my first email here. Now I teach digital basics to women in my neighbourhood.",
  },
  {
    name: "Rekha",
    role: "Community Mobilizer",
    quote:
      "The most powerful change is seeing women speak up in rooms where they were silent.",
  },
];

export default function HomeAnimatedSections({
  featuredPrograms,
}: {
  featuredPrograms: Program[];
}) {
  const shouldReduceMotion = useReducedMotion();

  // Explicitly type as Transition
  const springCfg: Transition = shouldReduceMotion
    ? { duration: 0.14, ease: "linear" }
    : { type: "spring", stiffness: 110, damping: 18, mass: 0.9 };

  // Explicitly type as Variants
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0.02 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        ...springCfg,
        delay: custom * (shouldReduceMotion ? 0.02 : 0.04),
      },
    }),
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Impact Counters */}
      <motion.section
        className="mx-auto max-w-7xl rounded-3xl bg-background/70 p-4 sm:p-6 lg:p-8 shadow-sm backdrop-blur border border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.28 }}
        variants={container}
      >
        <motion.div className="mb-8 text-center" variants={fadeInUp} custom={0}>
          <p className="text-sm font-semibold tracking-wide text-secondary">
            Quiet numbers, deep impact
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Where your support is already changing lives
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={container}
        >
          {impactCounters.map((item, i) => {
            const { count, ref } = useCountUp(item.value);
            return (
              <motion.div
                key={item.label}
                ref={ref as any}
                className="rounded-2xl border border-border bg-gradient-to-b from-background to-card p-6 text-center shadow-sm"
                variants={fadeInUp}
                custom={i}
              >
                <p
                  className="text-4xl font-semibold text-accent"
                  aria-live="polite"
                >
                  {count.toLocaleString()}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Listening Section */}
      <section className="mx-auto max-w-7xl grid gap-10 px-4 sm:px-6 lg:px-8 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-start py-12">
        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
          variants={container}
        >
          <motion.h2
            className="text-3xl font-bold text-primary"
            variants={fadeInUp}
            custom={0}
          >
            Change that begins with listening
          </motion.h2>
          <motion.p
            className="text-foreground max-w-prose"
            variants={fadeInUp}
            custom={1}
          >
            We start by creating safe circles where women and youth can speak
            freely. From there we co-design programs that slot into daily life.
          </motion.p>
          <motion.div
            className="grid gap-4 md:grid-cols-2"
            variants={container}
          >
            {[
              "Safe beginnings",
              "Skills that stick",
              "Networks of support",
              "Long-term presence",
            ].map((title, idx) => (
              <motion.article
                key={title}
                className={`rounded-2xl border border-border p-5 shadow-sm ${idx % 3 === 0 ? "bg-background" : "bg-card"}`}
                variants={fadeInUp}
                custom={idx}
              >
                <h3 className="text-xs font-semibold text-accent">
                  0{idx + 1}. {title}
                </h3>
                <p className="mt-2 text-sm text-foreground">
                  Strategic support designed to build lasting independence, not
                  just temporary relief.
                </p>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>

        <motion.aside
          className="space-y-4 rounded-3xl bg-card p-6 text-card-foreground shadow-xl"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: shouldReduceMotion ? 0.12 : 0.6,
            ease: "easeOut",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Field note
          </p>
          <blockquote className="mt-3 text-sm leading-relaxed text-card-foreground">
            “We don't promise overnight transformation. We show up every week,
            in the same room, until confidence grows into action.”
          </blockquote>
          <p className="mt-4 text-xs text-muted-foreground opacity-80">
            - Progress Women Society - Programme Lead
          </p>
        </motion.aside>
      </section>

      {/* Programs Grid */}
      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Our current focus
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Programs led with women, not for them
            </h2>
          </div>
          <Link
            href="/programs"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            View all programs →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms.map((program) => (
            <motion.article
              key={program.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="rounded-full bg-background px-3 py-1 font-medium text-primary">
                  {program.category ?? "Community program"}
                </span>
                <span className="rounded-full bg-accent/80 px-3 py-1 font-semibold text-accent-foreground">
                  {program.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-primary">
                {program.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {program.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <p>
                  Budget:{" "}
                  <span className="font-semibold text-primary">
                    ₹{program.budget?.toLocaleString()}
                  </span>
                </p>
                <Link
                  href={`/programs/${program.id}`}
                  className="font-semibold text-secondary hover:underline"
                >
                  Read story →
                </Link>
              </div>
            </motion.article>
          ))}
          {featuredPrograms.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-background/50 px-6 py-10 text-center text-sm text-muted-foreground">
              Programs will appear here as soon as they are published.
            </div>
          )}
        </div>
      </section>

      {/* Transparency */}
      <section className="mx-auto max-w-7xl space-y-6 rounded-3xl bg-primary/50 p-4 sm:p-6 lg:p-8 text-foreground">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Radical transparency
            </p>
            <h2 className="mt-2 text-3xl font-bold">Where every rupee goes</h2>
          </div>
          <Link
            href="/donations"
            className="text-sm font-medium text-accent hover:text-white"
          >
            Support with confidence →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-center">
          <div className="space-y-4">
            <div className="relative h-3 overflow-hidden rounded-full bg-primary-foreground/10">
              <div className="flex h-full w-full">
                {transparencyData.map((slice, i) => (
                  <motion.div
                    key={slice.label}
                    className="h-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: slice.value }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.4 : 1,
                      ease: "easeOut",
                    }}
                    style={{
                      background:
                        i === 0
                          ? "hsl(var(--accent))"
                          : i === 1
                            ? "hsl(var(--background))"
                            : i === 2
                              ? "hsl(var(--secondary))"
                              : "#ffffff",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-primary-foreground/5 p-5 text-xs">
            <p className="font-semibold text-white">Your trust checklist</p>
            <ul className="mt-2 space-y-2 text-primary-foreground/80 list-disc list-inside">
              <li>Independent annual audits available on request</li>
              <li>Clear separation of program and admin costs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl rounded-3xl border border-dashed border-border bg-background p-8 text-center mt-12">
        <h2 className="text-2xl font-semibold text-primary md:text-3xl">
          Your support can be the quiet turning point in someone's story.
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/donations"
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-95 transition"
          >
            Make a contribution
          </Link>
          <Link
            href="/volunteers"
            className="rounded-full border border-primary bg-transparent px-6 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition"
          >
            Offer your time & skills
          </Link>
        </div>
      </section>
    </div>
  );
}
