import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 xl:gap-24 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <img
                src="/assets/images/logo.svg"
                alt="Progress Women Society"
                className="h-16 w-auto"
              />
              <span className="font-bold tracking-tight text-primary text-xl">
                Progress Women Society
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              Empowering women, educating children, and restoring hope in
              communities. Change begins with a single step.
            </p>
            <Link
              href="/donations"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <Heart size={16} className="text-accent" /> Support our work
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">
              Initiatives
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/programs"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Skill Training
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Legal Aid Camps
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Child Education
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Healthcare Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">
              Get Involved
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/donations"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Donate Securely
                </Link>
              </li>
              <li>
                <Link
                  href="/volunteers"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Become a Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span>
                  123 Foundation House, Safdarjung Enclave, New Delhi 110029
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={18} className="text-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={18} className="text-accent shrink-0" />
                <a
                  href="mailto:hello@progresswomensociety.org"
                  className="hover:text-accent transition-colors"
                >
                  hello@progresswomensociety.org
                </a>
              </li>
              <li>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                  href="/login"
                >
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-border pt-8 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Progress Women Society Foundation. All
            rights reserved. Reg No. 12345/Delhi.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
