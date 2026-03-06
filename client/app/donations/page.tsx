"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import DonationForm from "../../components/DonationForm";

const donationAmounts = [500, 1000, 2500, 5000, 10000];

const impactMessages = {
  500: "Provides 2 weeks of digital literacy training for one woman",
  1000: "Supports a month of skill development workshops",
  2500: "Funds micro-enterprise startup kits for 3 women",
  5000: "Creates sustainable livelihood programs for 5 families",
  10000: "Establishes community learning centers for 20+ women",
};

export default function DonationsPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSuccess = () => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Make a difference today
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl">
            Your support <span className="text-accent">transforms lives.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Every contribution helps women build skills, start businesses, and
            create brighter, independent futures for their families.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,450px)] items-start">
          {/* Left Column: Form & Alternative Methods */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* 1. Amount Selection */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-2xl font-semibold text-card-foreground">
                1. Choose Your Impact
              </h2>

              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={`relative rounded-2xl border-2 p-4 text-center transition-all duration-200 ${
                      selectedAmount === amount
                        ? "border-accent bg-accent/10 text-primary shadow-inner"
                        : "border-border bg-background text-primary hover:border-accent/40 hover:bg-accent/20"
                    }`}
                  >
                    <div className="text-xl font-bold">
                      ₹{amount.toLocaleString()}
                    </div>
                    {selectedAmount === amount && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>

              {/* Impact Message */}
              <AnimatePresence mode="wait">
                {selectedAmount &&
                  impactMessages[
                    selectedAmount as keyof typeof impactMessages
                  ] && (
                    <motion.div
                      key={selectedAmount}
                      className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-muted/70 p-5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent">
                        <svg
                          className="h-5 w-5 text-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-primary">
                        {
                          impactMessages[
                            selectedAmount as keyof typeof impactMessages
                          ]
                        }
                      </p>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>

            {/* 2. Main Donation Form (Razorpay) */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-2xl font-semibold text-primary">
                2. Your Details
              </h2>
              <DonationForm
                prefilledAmount={selectedAmount}
                onSuccess={handleSuccess}
              />
            </div>

            {/* 3. Alternative Payment Methods (QR & Bank) */}
            <motion.div
              className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="mb-4 text-xl font-semibold text-primary">
                Alternative Payment Methods
              </h2>

              {/* QR Code Accordion */}
              <div className="rounded-2xl border border-border bg-background overflow-hidden">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex w-full items-center justify-between p-5 text-left focus:outline-none group hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-6 w-6 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <span className="font-semibold text-primary">
                      Pay via UPI QR Code
                    </span>
                  </div>
                  <motion.svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: showQR ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border bg-card/50 p-6"
                    >
                      <p className="mb-6 text-center text-sm text-muted-foreground">
                        Scan with any UPI app (GPay, PhonePe, Paytm) to donate
                        directly.
                      </p>
                      <div className="flex justify-center">
                        <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-background shadow-inner border border-border">
                          {/* Replace this SVG with your actual NGO QR Code Image */}
                          <svg
                            className="h-24 w-24 text-primary/20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 3h6v6H3V3zm0 8h6v6H3v-6zm8-8h6v6h-6V3zm0 8h6v6h-6v-6z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-xs uppercase tracking-widest text-secondary font-bold">
                          UPI ID
                        </p>
                        <p className="mt-1 font-mono text-lg font-medium text-primary">
                          pws.donations@upi
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bank Transfer Accordion */}
              <div className="rounded-2xl border border-border bg-background overflow-hidden">
                <button
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="flex w-full items-center justify-between p-5 text-left focus:outline-none group hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-6 w-6 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="font-semibold text-primary">
                      Direct Bank Transfer (NEFT/RTGS)
                    </span>
                  </div>
                  <motion.svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: showBankDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {showBankDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border bg-card/50 p-6"
                    >
                      <p className="mb-6 text-sm text-muted-foreground">
                        For larger donations or corporate CSR contributions, you
                        can transfer funds directly to our verified NGO bank
                        account.
                      </p>

                      <div className="space-y-4 rounded-xl bg-background p-5 border border-border">
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border pb-3">
                          <span className="text-sm text-muted-foreground mb-1 sm:mb-0">
                            Account Name
                          </span>
                          <span className="font-semibold text-primary">
                            Progress Women Society
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border pb-3">
                          <span className="text-sm text-muted-foreground mb-1 sm:mb-0">
                            Account Number
                          </span>
                          <span className="font-mono font-semibold text-primary tracking-wider">
                            987654321000
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border pb-3">
                          <span className="text-sm text-muted-foreground mb-1 sm:mb-0">
                            IFSC Code
                          </span>
                          <span className="font-mono font-semibold text-primary tracking-wider">
                            HDFC0001234
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border pb-3">
                          <span className="text-sm text-muted-foreground mb-1 sm:mb-0">
                            Bank & Branch
                          </span>
                          <span className="font-semibold text-primary text-right">
                            HDFC Bank
                            <br />
                            <span className="font-normal text-sm">
                              Connaught Place, New Delhi
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-sm text-muted-foreground mb-1 sm:mb-0">
                            Account Type
                          </span>
                          <span className="font-semibold text-primary">
                            Current Account
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg bg-secondary/30 p-4 text-xs text-card-foreground">
                        <strong>Note:</strong> If you require an 80G tax
                        exemption receipt for a direct wire transfer, please
                        email your transaction reference number and PAN card
                        details to{" "}
                        <a
                          href="mailto:finance@progresswomensociety.org"
                          className="underline font-bold"
                        >
                          finance@progresswomensociety.org
                        </a>
                        .
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Trust & Sidebar */}
          <motion.aside
            className="space-y-6"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-3xl bg-secondary/20 p-8 text-card-foreground shadow-xl">
              <h3 className="mb-6 text-xl font-semibold text-secondary">
                Our Commitment
              </h3>
              <ul className="space-y-4">
                {[
                  "100% secure encrypted checkout via Razorpay.",
                  "Direct impact tracking and transparent reporting.",
                  "Funds allocated specifically to women's empowerment and community resilience.",
                  "Annual audits available publicly.",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                  >
                    <svg
                      className="mt-1 h-5 w-5 shrink-0 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-secondary/20 p-8">
              <h3 className="mb-2 text-lg font-semibold text-primary">
                Need help?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Having trouble with your payment or need assistance with
                corporate CSR?
              </p>
              <a
                href="mailto:support@progresswomensociety.org"
                className="text-sm font-semibold text-secondary hover:underline"
              >
                Contact our support team →
              </a>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Cinematic Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-3xl bg-background p-10 text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                <svg
                  className="h-10 w-10 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-3xl font-bold text-primary">
                Thank You!
              </h3>
              <p className="mb-8 text-muted-foreground">
                Your contribution securely reached us. We've sent a receipt to
                your email, and you've just helped take a concrete step toward
                empowering another life.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Return to site
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
