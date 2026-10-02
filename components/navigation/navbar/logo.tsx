"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/animation";

const Logo = () => {
  const logoRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".logo-icon", {
        opacity: 0,
        rotateX: 90,
        rotateY: 90,
        duration: 0.5,
        ease: "back.out(1.7)",
      }).from(
        ".logo-letter1",
        { x: 40, opacity: 0, stagger: 0.05, duration: 0.35 },
        0.05,
      ).from(
        ".logo-letter2",
        { x: 40, opacity: 0, stagger: 0.05, duration: 0.35 },
        0.15,
      );
    },
    { scope: logoRef },
  );
  return (
    <Link href="/" className="flex items-center gap-1" ref={logoRef}>
      <Image
        src="/images/site-logo.svg"
        className="logo-icon"
        alt="BaseCase logo"
        width={23}
        height={23}
      />
      <p
        className="h2-bold font-logofont text-dark-100 dark:text-light-900 max-sm:hidden"
      >
        <span className="logo-letter1 inline-block">B</span>
        <span className="logo-letter1 inline-block">a</span>
        <span className="logo-letter1 inline-block">s</span>
        <span className="logo-letter1 inline-block">e</span>
        <span className="text-primary-500">
          <span className="logo-letter2 inline-block">C</span>
          <span className="logo-letter2 inline-block">a</span>
          <span className="logo-letter2 inline-block">s</span>
          <span className="logo-letter2 inline-block">e</span>
        </span>
      </p>
    </Link>
  );
};

export default Logo;
