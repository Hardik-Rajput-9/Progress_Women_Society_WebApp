"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { volunteersApi } from "../../lib/api";
import { VolunteerAvailability } from "@pws/shared";

// --- Context Banner Component ---
function ContextBanner() {
  const searchParams = useSearchParams();
  const contextName = searchParams.get("name");
  const contextType = searchParams.get("context");

  if (!contextName) return null;

  return (
    <div className="mb-8 rounded-2xl bg-accent/10 border border-accent/20 p-4 sm:p-6 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <CheckCircle className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-primary">
          You are registering for a specific {contextType}!
        </h3>
        <p className="text-sm font-medium text-accent">"{contextName}"</p>
      </div>
    </div>
  );
}

const steps = [
  { id: "personal", title: "Personal Details", description: "Who are you?" },
  {
    id: "skills",
    title: "Skills & Interests",
    description: "How can you help?",
  },
  {
    id: "review",
    title: "Review & Join",
    description: "Confirm your commitment",
  },
];

export default function VolunteersPage() {
  const shouldReduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [] as string[],
    interests: [] as string[],
    availability: VolunteerAvailability.FLEXIBLE as VolunteerAvailability,
  });

  const handleInputChange = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleArrayItem = (field: "skills" | "interests", item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleNext = () => {
    if (currentStep === 0 && (!formData.name || !formData.email)) {
      toast.error("Please fill in your name and email.");
      return;
    }
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting application...");

    try {
      // Capture context locally to avoid passing it through multiple states
      const urlParams = new URLSearchParams(window.location.search);
      const contextName = urlParams.get("name");

      const payload: any = {
        name: formData.name,
        email: formData.email,
        availability: formData.availability,
        skills: [...formData.skills],
        interests: formData.interests,
      };

      if (formData.phone && formData.phone.trim() !== "")
        payload.phone = formData.phone;
      if (contextName) payload.skills.push(`[Context: ${contextName}]`); // Tag the context into the skills array

      await volunteersApi.create(payload);

      toast.success("Application received!", { id: toastId });
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit application.",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -20,
      transition: { duration: 0.3 },
    },
  };

  if (submitSuccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-background px-6">
        <motion.div
          className="w-full max-w-md rounded-3xl bg-card p-10 text-center shadow-2xl border border-border"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
            <CheckCircle className="h-10 w-10 text-accent-foreground" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Welcome to the Circle
          </h2>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Your application is securely stored. Our coordinator will review
            your profile and reach out via email within 3 business days.
          </p>
          <Link
            href="/programs"
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Explore Active Programs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:px-6 md:py-24 lg:px-8 lg:py-24">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Join the movement
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
            Become a <span className="text-accent">Volunteer</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Share your skills, gain ground-level experience, and help us create
            systemic change.
          </p>
        </div>

        <div className="mb-12">
          {/* Progress Timeline... */}
          <div className="mb-6 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex w-full items-center">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500 ${index <= currentStep ? "bg-primary text-background shadow-md" : "bg-card border-2 border-border text-muted-foreground"}`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-[2px] w-full rounded-full transition-colors duration-500 ${index < currentStep ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center md:text-left md:ml-2">
            <h3 className="text-xl font-bold text-primary">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="h-10" />}>
          <ContextBanner />
        </Suspense>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-card-foreground">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full rounded-xl border border-border bg-background p-4 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="Your legal name"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-primary">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full rounded-xl border border-border bg-background p-4 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="hello@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-primary">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-background p-4 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <label className="mb-4 block font-semibold text-primary">
                        What practical skills can you offer?
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "Teaching/Mentoring",
                          "Digital Skills",
                          "Content Writing",
                          "Design",
                          "Event Logistics",
                          "Legal Advice",
                          "Healthcare",
                        ].map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleArrayItem("skills", skill)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${formData.skills.includes(skill) ? "bg-primary/30 shadow-md" : "bg-background text-muted-foreground border border-border hover:border-primary"}`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-4 block font-semibold text-primary">
                        Which focus areas interest you?
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "Education",
                          "Women's Safety",
                          "Micro-finance",
                          "Health Camps",
                          "Advocacy",
                        ].map((interest) => (
                          <button
                            key={interest}
                            onClick={() =>
                              toggleArrayItem("interests", interest)
                            }
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${formData.interests.includes(interest) ? "bg-accent text-accent-foreground shadow-md" : "bg-background text-muted-foreground border border-border hover:border-accent"}`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold text-primary">
                        Standard Availability
                      </label>
                      <select
                        value={formData.availability}
                        onChange={(e) =>
                          handleInputChange("availability", e.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-background p-4 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value={VolunteerAvailability.FLEXIBLE}>
                          Flexible / Ad-hoc
                        </option>
                        <option value={VolunteerAvailability.WEEKDAYS}>
                          Weekdays (Standard Hours)
                        </option>
                        <option value={VolunteerAvailability.WEEKENDS}>
                          Weekends
                        </option>
                        <option value={VolunteerAvailability.EVENINGS}>
                          Evenings Only
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 rounded-2xl bg-background p-6 border border-border">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Contact
                        </p>
                        <p className="mt-1 font-medium text-primary">
                          {formData.name}
                        </p>
                        <p className="text-sm text-primary/80">
                          {formData.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Commitment
                        </p>
                        <p className="mt-1 font-medium text-primary">
                          {formData.availability
                            .toLowerCase()
                            .replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Profile
                      </p>
                      <p className="mt-2 text-sm text-primary/80">
                        <strong>Skills:</strong>{" "}
                        {formData.skills.length > 0
                          ? formData.skills.join(", ")
                          : "None specified"}
                      </p>
                      <p className="mt-1 text-sm text-primary/80">
                        <strong>Interests:</strong>{" "}
                        {formData.interests.length > 0
                          ? formData.interests.join(", ")
                          : "None specified"}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0 || isSubmitting}
                className="rounded-xl px-6 py-3 font-semibold text-muted-foreground transition-colors hover:bg-background disabled:opacity-0"
              >
                ← Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded-xl bg-accent px-8 py-3 font-semibold text-accent-foreground shadow-md transition-all hover:brightness-95 disabled:opacity-70"
                >
                  {isSubmitting ? "Processing..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
