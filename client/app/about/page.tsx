"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Target, Shield, BookOpen, Heart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.15,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const corePillars = [
    {
      icon: <Target className="h-6 w-6 text-accent" />,
      title: "Economic Independence",
      description:
        "We don't just teach skills; we build micro-entrepreneurs. From digital literacy to artisan crafts, we bridge the gap between raw talent and market access.",
    },
    {
      icon: <Shield className="h-6 w-6 text-accent" />,
      title: "Justice & Advocacy",
      description:
        "Building on our legacy with the Mahila Panchayat, we continue to guide women through legal frameworks, helping them secure their rights, safety, and official identities.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-accent" />,
      title: "Next-Gen Education",
      description:
        "Empowering a mother changes a family; educating her children changes the future. We provide crucial after-school support to first-generation learners.",
    },
    {
      icon: <Heart className="h-6 w-6 text-accent" />,
      title: "Holistic Well-being",
      description:
        "Progress is impossible without health. Our grassroots health and eye camps ensure that vulnerable families have continuous access to basic medical care and essentials.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* 1. Cinematic Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              <motion.p
                variants={fadeInUp}
                className="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary"
              >
                Our Story
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="mb-6 text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl"
              >
                Change begins when{" "}
                <span className="text-accent">women lead.</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="mb-8 text-lg leading-relaxed text-muted-foreground"
              >
                Progress Women Society (PWS) Foundation was built on a single,
                unwavering belief: the most effective way to uplift a community
                is to empower its women. Operating at the grassroots level in
                Delhi NCR, we dismantle systemic barriers through skill
                training, legal advocacy, and holistic support.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link
                  href="/programs"
                  className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                >
                  See Our Impact
                </Link>
                <Link
                  href="/donations"
                  className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 font-semibold text-card-foreground transition-all hover:border-accent hover:bg-accent/5"
                >
                  Fund the Mission
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative aspect-[4/5] w-full max-w-lg mx-auto lg:max-w-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-primary/5 -rotate-3 transform transition-transform duration-500 hover:rotate-0" />
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-border bg-white shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&q=80&w=1200"
                  alt="Women working together in a community circle"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. The PWS Approach */}
      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mb-16 max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-primary md:text-4xl"
            >
              Not just relief. <span className="text-accent">Resilience.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              We don't operate from distant boardrooms. We sit in the community
              circles. By listening first, we co-design interventions that
              address the actual, lived realities of the women and youth we
              serve.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={container}
          >
            {corePillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group rounded-3xl border border-border bg-background p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/30"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-border group-hover:bg-accent/10 transition-colors">
                  {pillar.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Deep Dive / Legacy Story */}
      <section className="bg-background py-24 text-foreground overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 opacity-5 pointer-events-none">
            <svg
              width="400"
              height="400"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M45.7,-76.4C58.9,-69.3,69.1,-55.3,77.5,-40.8C85.9,-26.3,92.5,-11.3,91.3,3.1C90.1,17.5,81.1,31.3,71.2,43.2C61.3,55.1,50.5,65.2,37.6,71.7C24.7,78.2,9.7,81.1,-5.5,84.3C-20.7,87.5,-36.1,90.8,-49.3,85.1C-62.5,79.4,-73.5,64.7,-81.1,49.2C-88.7,33.7,-92.9,17.5,-90.6,2.2C-88.3,-13.1,-79.5,-27.5,-70.2,-40.2C60.9,-52.9,-51.1,-63.9,-39.3,-71.9C-27.5,-79.9,-13.8,-84.7,1.2,-86.7C16.2,-88.7,32.5,-83.5,45.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-center relative z-10">
            <motion.div
              className="order-2 lg:order-1 relative aspect-square max-w-md mx-auto w-full"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-accent/30 scale-105" />
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-background">
                <Image
                  src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800"
                  alt="Community collaboration"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={container}
            >
              <motion.h2
                variants={fadeInUp}
                className="mb-6 text-3xl font-bold md:text-4xl"
              >
                A Legacy of Trust
              </motion.h2>
              <motion.div
                variants={fadeInUp}
                className="space-y-6 text-foreground/80 text-lg"
              >
                <p>
                  PWS Foundation did not start in an office; it started in the
                  narrow lanes of Delhi's urban villages. We saw women with
                  immense potential being held back by a lack of documentation,
                  financial literacy, and safe spaces.
                </p>
                <p>
                  Our landmark collaboration with the Delhi Women Commission on
                  the <strong>Mahila Panchayat</strong> program proved that when
                  you give women a platform to understand their legal rights,
                  they don't just protect themselves—they protect their entire
                  neighborhood.
                </p>
                <p>
                  Today, we have evolved into a multi-vertical NGO. Whether we
                  are distributing vital hygiene kits during health camps or
                  graduating our latest cohort of digital literacy students, our
                  core metric remains the same:{" "}
                  <span className="text-accent font-semibold">
                    measurable human dignity.
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Transparency & Accountability */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
            className="mx-auto max-w-2xl mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-primary"
            >
              Committed to Radical Transparency
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground">
              We view every donation as a sacred trust. Our operations are lean,
              our impact is tracked, and our finances are independently audited
              every single year.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            {[
              { label: "Registered NGO", value: "80G & 12A" },
              { label: "Annual Audits", value: "Independent" },
              { label: "Program Focus", value: "Direct Impact" },
              { label: "Community Led", value: "100%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="rounded-2xl bg-card border border-border p-6 shadow-sm"
              >
                <div className="text-2xl font-black text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-card-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-3xl font-bold text-card-foreground md:text-4xl">
            You don't need to change the whole world.
            <br />
            <span className="text-accent">Just someone's world.</span>
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Whether you offer your time, your skills, or your financial support,
            you are the engine that keeps this work moving forward.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/donations"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-105"
            >
              Make a Donation <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/volunteers"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-transparent px-8 py-4 text-lg font-semibold text-primary transition-all hover:border-primary hover:bg-background"
            >
              Join as Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
