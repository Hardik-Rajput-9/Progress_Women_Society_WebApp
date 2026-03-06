"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8 selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-4">
            Let's Start a <span className="text-accent">Conversation</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you want to partner with us, ask a question, or simply learn
            more about our initiatives, our doors are always open.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-xl"
          >
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-border bg-background p-4 focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-border bg-background p-4 focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-border bg-background p-4 focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-border bg-background p-4 focus:ring-2 focus:ring-accent focus:outline-none transition-shadow resize-none"
                  placeholder="How can we collaborate?..."
                />
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-primary text-primary-foreground py-4 font-bold text-lg flex justify-center items-center gap-2 hover:bg-primary/90 hover:scale-[1.01] transition-all shadow-md"
              >
                <Send className="h-5 w-5" /> Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 lg:mt-10"
          >
            <div className="flex items-start gap-6 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Headquarters
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  123 Progress Avenue, Suite 400
                  <br />
                  New Delhi, Delhi 110001
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Email Us
                </h3>
                <p className="text-muted-foreground">
                  contact@pwsfoundation.org
                </p>
                <p className="text-muted-foreground">
                  partnerships@pwsfoundation.org
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Call Us</h3>
                <p className="text-muted-foreground">+91 98765 43210</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Mon-Fri from 9am to 6pm
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
