"use client";

import { useRef } from "react";
import Link from "next/link";
import { useHeroScrollProgress } from "../hooks/useHeroScrollProgress";

type CinematicHeroProps = {
  className?: string;
  animationDelay?: number;
  disableAnimation?: boolean;
};

export default function CinematicHero({
  className,
  animationDelay = 0,
  disableAnimation = false,
}: CinematicHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const maxScroll = 4.0;

  const rawProgress = useHeroScrollProgress(heroRef, {
    max: maxScroll,
    startOffsetVh: 20,
    endOffsetVh: 20,
  });

  const delayed = disableAnimation
    ? rawProgress
    : Math.max(0, rawProgress - animationDelay / 1000 / 2);

  const p = disableAnimation ? maxScroll : delayed;
  const meetProgress = Math.min(p, 1.2) / 1.2;
  const logoRevealProgress = Math.max(0, Math.min(1, (p - 1.8) / 0.8));

  const finalPhaseProgress = Math.max(0, Math.min(1, (p - 3.2) / 0.6));

  const handsOpacity = 1 - logoRevealProgress;
  const logoOpacity = logoRevealProgress;
  const logoScale = 0.9 + 0.1 * logoRevealProgress;

  const sunY = (1 - meetProgress) * 45;
  const sunScale = 0.92 + 0.08 * meetProgress;
  const sunBrightness = 0.65 + 0.95 * meetProgress;
  const sunOpacity = 0.75 + 0.25 * meetProgress;

  // Boosted the glow multiplier for a more radiant backlight
  const glowOpacity = Math.min(1.2, meetProgress * 1.5);
  const glowBlur = 30 + 50 * meetProgress;

  const topX = (-120 + 80 * meetProgress).toFixed(3);
  const topY = (-120 + 85 * meetProgress).toFixed(3);
  const bottomX = (120 - 85 * meetProgress).toFixed(3);
  const bottomY = (120 - 85 * meetProgress).toFixed(3);

  const handFilter = `brightness(${0.92 + 0.18 * meetProgress})`;

  const artShiftY = finalPhaseProgress * -25;
  const finalArtScale = 1 - finalPhaseProgress * 0.25;

  const fadeWindow = 0.3;
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const makePhaseOpacity = (start: number, end: number) => {
    const fadeIn = clamp01((p - start) / fadeWindow);
    const fadeOut = clamp01((end - p) / fadeWindow);
    return fadeIn * fadeOut;
  };

  const phase1Opacity = makePhaseOpacity(-0.2, 1.0);
  const phase2Opacity = makePhaseOpacity(1.0, 2.0);
  const phase3Opacity = makePhaseOpacity(1.8, 2.8);
  const phase4Opacity = makePhaseOpacity(2.6, 3.4);
  const phase5Opacity = makePhaseOpacity(3.2, 5.0);

  const phase1Y = (1 - phase1Opacity) * 20;
  const phase2Y = (1 - phase2Opacity) * 20;
  const phase3Y = (1 - phase3Opacity) * 20;
  const phase4Y = (1 - phase4Opacity) * 20;
  const phase5Y = (1 - phase5Opacity) * 20;

  const artDimensions =
    "h-[min(350px,75vw)] w-[min(350px,75vw)] md:h-[min(600px,70vw)] md:w-[min(600px,70vw)]";

  const skipButtonOpacity = 1 - finalPhaseProgress;

  const handleSkip = () => {
    if (heroRef.current) {
      const nextSectionY =
        heroRef.current.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top: nextSectionY, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      className={["relative h-[500vh] w-full bg-background", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* RADIANT GRADIENT BACKGROUND:
        Light Mode: Bright amber center fading beautifully into warm orange and a soft edge.
        Dark Mode: Intense amber/orange "spotlight" in the center to backlight the black SVGs, 
                   fading dramatically into a pure dark background at the edges.
      */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-orange-300 to-orange-50 dark:from-amber-500/30 dark:via-orange-950/60 dark:to-background transition-colors duration-700">
        {/* HEADER PROTECTOR: Smooth gradient fade at the top to ensure the navigation text is always perfectly readable against the moving black hands */}
        <div className="absolute top-0 inset-x-0 h-28 md:h-36 bg-gradient-to-b from-background via-background/80 to-transparent z-[20] pointer-events-none" />

        <div
          className="pointer-events-none absolute inset-0 will-change-transform flex items-center justify-center origin-center"
          style={{
            transform: `translateY(${artShiftY}vh) scale(${finalArtScale})`,
          }}
        >
          <div className="relative w-full h-full">
            {/* Layer 1: The Sun/Glow */}
            <div className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div
                className={`relative ${artDimensions} will-change-transform will-change-opacity`}
                style={{
                  transform: `translate3d(0,0,0) translateY(${sunY}vh) scale(${sunScale})`,
                  opacity: sunOpacity,
                  filter: `brightness(${sunBrightness})`,
                }}
              >
                {/* ENHANCED BACKLIGHT GLOW: 
                  This creates a massive, feathered spotlight directly behind the hands, 
                  ensuring the black SVGs pop perfectly against the dark mode edges.
                */}
                <div
                  className="absolute inset-[-20%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255,180,80,0.8) 0%, rgba(255,120,30,0.3) 40%, transparent 75%)",
                    opacity: glowOpacity,
                    filter: `blur(${glowBlur}px)`,
                    transform: "scale(1.1)",
                  }}
                />
                <img
                  src="/assets/images/sun.svg"
                  alt=""
                  aria-hidden="true"
                  className="relative z-[1] h-full w-full select-none object-contain"
                  draggable={false}
                />
              </div>
            </div>

            {/* Layer 2: The Hands */}
            <div className="absolute inset-0 z-[2]">
              <div
                className="absolute left-1/2 top-1/2 will-change-transform will-change-opacity"
                style={{ opacity: handsOpacity, filter: handFilter }}
              >
                <div
                  className="absolute left-1/2 top-1/2 w-[min(700px,60vw)] md:w-[min(1000px,65vw)] -translate-x-1/2 -translate-y-1/2 hidden md:block"
                  style={{
                    transform: `translate3d(-50%, -50%, 0) translate(${topX}%, ${topY}%)`,
                  }}
                >
                  <img
                    src="/assets/images/hand-top-desktop.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-auto w-full select-none object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    draggable={false}
                  />
                </div>
                <div
                  className="absolute left-1/2 top-1/2 w-[min(600px,70vw)] -translate-x-1/2 -translate-y-1/2 block md:hidden"
                  style={{
                    transform: `translate3d(-50%, -50%, 0) translate(${topX}%, ${topY}%)`,
                  }}
                >
                  <img
                    src="/assets/images/hand-top-mobile.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-auto w-full select-none object-contain"
                    draggable={false}
                  />
                </div>
                <div
                  className="absolute left-1/2 top-1/2 w-[min(700px,60vw)] md:w-[min(1000px,65vw)] -translate-x-1/2 -translate-y-1/2 hidden md:block"
                  style={{
                    transform: `translate3d(-50%, -50%, 0) translate(${bottomX}%, ${bottomY}%)`,
                  }}
                >
                  <img
                    src="/assets/images/hand-bottom-desktop.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-auto w-full select-none object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    draggable={false}
                  />
                </div>
                <div
                  className="absolute left-1/2 top-1/2 w-[min(600px,60vw)] -translate-x-1/2 -translate-y-1/2 block md:hidden"
                  style={{
                    transform: `translate3d(-50%, -50%, 0) translate(${bottomX}%, ${bottomY}%)`,
                  }}
                >
                  <img
                    src="/assets/images/hand-bottom-mobile.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-auto w-full select-none object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Layer 3: The Logo Reveal */}
            <div className="absolute inset-0 z-[3] flex items-center justify-center">
              <div
                className={`relative flex items-center justify-center ${artDimensions} will-change-transform`}
                style={{
                  opacity: logoOpacity,
                  transform: `translate3d(0,0,0) scale(${logoScale})`,
                }}
              >
                <div
                  className="absolute inset-[-30%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255,212,143,0.55), transparent 55%), radial-gradient(circle at center, rgba(255,212,143,0.22), transparent 70%)",
                    opacity: Math.min(1, glowOpacity + logoOpacity * 0.6),
                    filter: `blur(${18 + 22 * logoOpacity}px)`,
                  }}
                  aria-hidden="true"
                />
                <img
                  src="/assets/images/logo.svg"
                  alt="NGO logo"
                  className="relative z-[4] h-[60%] w-[60%] select-none object-contain drop-shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOREGROUND CONTENT LAYER       */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {/* Phase 1: Tagline */}
          <div className="absolute top-[10vh] md:top-[12vh] right-[6vw] lg:right-auto lg:left-1/2 lg:-translate-x-1/2 w-full max-w-[85vw] lg:max-w-[1000px]">
            <div
              className="flex flex-col items-end lg:items-center text-right lg:text-center will-change-transform will-change-opacity"
              style={{
                opacity: phase1Opacity,
                transform: `translate3d(0, ${phase1Y}px, 0)`,
              }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#F4EFE6] drop-shadow-xl">
                Empower Lives.
                <br className="lg:hidden" />
                <span className="text-[#E5B94A] lg:ml-4">Restore Hope.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#F4EFE6]/80 drop-shadow-md max-w-[250px] sm:max-w-[400px] lg:max-w-[600px]">
                Every journey to lasting change starts with a single, courageous
                connection.
              </p>
            </div>
          </div>

          {/* Phase 2: Connection */}
          <div
            className="absolute bottom-[12vh] md:bottom-[15vh] left-[6vw] lg:left-[10vw] max-w-[85vw] sm:max-w-[450px] text-left will-change-transform will-change-opacity"
            style={{
              opacity: phase2Opacity,
              transform: `translate3d(0, ${phase2Y}px, 0)`,
            }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4EFE6] drop-shadow-xl">
              When <span className="text-[#E5B94A]">Support</span>
              <br />
              Meets Courage
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#F4EFE6]/80 drop-shadow-md max-w-[250px] sm:max-w-none">
              We stand with women and children, providing the strength they need
              to rewrite their futures.
            </p>
          </div>

          {/* Phase 3: The Work */}
          <div
            className="absolute top-[15vh] md:top-[20vh] left-[6vw] lg:left-[10vw] max-w-[85vw] sm:max-w-[450px] text-left will-change-transform will-change-opacity"
            style={{
              opacity: phase3Opacity,
              transform: `translate3d(0, ${phase3Y}px, 0)`,
            }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4EFE6] drop-shadow-xl">
              Skills. Education.
              <br />
              <span className="text-[#E5B94A]">Advocacy.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#F4EFE6]/80 drop-shadow-md max-w-[250px] sm:max-w-none">
              We design interventions that address the actual, lived realities
              of the communities we serve.
            </p>
          </div>

          {/* Phase 4: The Result */}
          <div
            className="absolute bottom-[20vh] md:bottom-[25vh] right-[6vw] lg:right-[10vw] max-w-[85vw] sm:max-w-[450px] text-right will-change-transform will-change-opacity"
            style={{
              opacity: phase4Opacity,
              transform: `translate3d(0, ${phase4Y}px, 0)`,
            }}
          >
            <div className="flex flex-col items-end">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#E5B94A] drop-shadow-xl">
                Generations
                <br />
                Transformed
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#F4EFE6]/80 drop-shadow-md max-w-[250px] sm:max-w-none">
                Progress doesn't stop with one person. It ripples through
                families and entire neighborhoods.
              </p>
            </div>
          </div>

          {/* Phase 5: The CTA */}
          <div
            className="absolute top-[72%] left-1/2 w-full max-w-[92vw] sm:max-w-[600px] text-center flex flex-col items-center will-change-transform will-change-opacity"
            style={{
              opacity: phase5Opacity,
              transform: `translate3d(-50%, calc(-50% + ${phase5Y}px), 0)`,
            }}
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4EFE6] drop-shadow-xl">
              A Future Built on{" "}
              <span className="text-[#E5B94A]">Empowerment</span>
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-[#F4EFE6]/90 drop-shadow-md max-w-[280px] sm:max-w-none px-2">
              Join us in creating a world where every woman has the tools to
              thrive.
            </p>

            <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pointer-events-auto px-4">
              <Link
                href="/donations"
                className="w-full sm:w-auto flex justify-center items-center rounded-full bg-[#E5B94A] px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-[#0E2A24] shadow-xl transition-all hover:scale-105 hover:bg-[#F4EFE6]"
              >
                Fund the Mission
              </Link>
              <Link
                href="/volunteers"
                className="w-full sm:w-auto flex justify-center items-center rounded-full border-2 border-[#E5B94A] bg-[#0E2A24]/50 backdrop-blur-sm px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-[#E5B94A] shadow-xl transition-all hover:bg-[#E5B94A] hover:text-[#0E2A24]"
              >
                Join as Volunteer
              </Link>
            </div>
          </div>
        </div>

        {/* THE "SKIP INTRO" COMPONENT */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] pointer-events-auto will-change-opacity"
          style={{
            opacity: skipButtonOpacity,
            pointerEvents: skipButtonOpacity > 0.1 ? "auto" : "none",
          }}
        >
          <button
            onClick={handleSkip}
            className="group flex flex-col items-center gap-2"
          >
            <span className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 transition-colors group-hover:bg-white/20 group-hover:text-white">
              Skip Intro
            </span>
            <svg
              className="h-5 w-5 text-white/60 group-hover:text-white animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
