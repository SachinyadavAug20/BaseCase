"use client";

import React, { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface AnimatedListProps {
  children: ReactNode;
  stagger?: number;
  duration?: number;
  y?: number;
  x?:number;
  className?: string;
}

const AnimatedList = ({
  children,
  stagger = 0.18,
  duration = 0.5,
  y = 30,
  x=30,
  className = "",
}: AnimatedListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !containerRef.current.children.length)
        return;
      gsap.from(containerRef.current.children, {
        y,
        x,
        opacity: 0,
        stagger,
        duration,
        scale:0.5,
        ease: "back.out(1.7)",
        clearProps: "all",
      });
    },
    { dependencies: [React.Children.count(children)] },
  );
  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default AnimatedList;
