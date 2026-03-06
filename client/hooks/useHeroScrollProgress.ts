"use client";

import { useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Options = {
  max?: number;
  startOffsetVh?: number;
  endOffsetVh?: number;
};

export function useHeroScrollProgress<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: Options = {},
) {
  const { max = 2, startOffsetVh = 20, endOffsetVh = 20 } = options;

  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startPx = (startOffsetVh / 100) * vh;
      const endPx = (endOffsetVh / 100) * vh;

      const total = rect.height + vh + startPx + endPx;
      const traveled = vh - rect.top + startPx;

      const raw = traveled / (total || 1);
      const next = clamp(raw * max, 0, max);

      if (Math.abs(next - progressRef.current) > 0.001) {
        progressRef.current = next;
        setProgress(next);
      }
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [ref, max, startOffsetVh, endOffsetVh]);

  return progress;
}
