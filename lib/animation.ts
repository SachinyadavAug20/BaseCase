export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const MOTION = {
  duration: 0.4,
  stagger: 0.06,
  distance: 16,
  ease: "power2.out",
} as const;
