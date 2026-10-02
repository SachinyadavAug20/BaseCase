"use client";

import React, { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MOTION, prefersReducedMotion } from "@/lib/animation";

interface AnimatedListProps {
  children: ReactNode;
  stagger?: number;
  duration?: number;
  y?: number;
  x?: number;
  className?: string;
}

const AnimatedList = ({
  children,
  stagger = MOTION.stagger,
  duration = MOTION.duration,
  y = MOTION.distance,
  x = 8,
  className = "",
}: AnimatedListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || !el.children.length || prefersReducedMotion()) return;

      const count = el.children.length;
      gsap.from(el.children, {
        y,
        x,
        opacity: 0,
        stagger: Math.min(stagger, 0.45 / count),
        duration,
        scale: 0.96,
        ease: MOTION.ease,
        clearProps: "all",
      });
    },
    { dependencies: [React.Children.count(children)], scope: containerRef },
  );
  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default AnimatedList;
