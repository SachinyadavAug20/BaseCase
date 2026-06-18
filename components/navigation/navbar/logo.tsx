"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  useGSAP(() => {
    gsap.from("#logo-letter1", {
      x: 100,
      opacity: 0,
      color: "blue",
      stagger: 0.2,
      ease: "power2.inOut",
      duration: 0.6,
    });
    gsap.from("#logo-letter2", {
      stagger: -0.15,
      x: 100,
      opacity: 0,
      color: "white",
      ease: "power2.inOut",
      duration: 0.6,
    });
    gsap.from("#logo-icon", {
      opacity:0,
      duration:1,
      ease:"back.out(1.9)",
      rotateX:90,
      rotateY:90,
      rotateZ:90,
    })
  });
  return (
    <>
      <Link href="/" className="flex items-center gap-1">
      <Image
        src="/images/site-logo.svg"
        id="logo-icon"
        alt="Devflow logo"
        width={23}
        height={23}
      />
      <p
        id="logo"
        className="h2-bold font-logofont text-dark-100 dark:text-light-900 max-sm:hidden"
      >
        <span id="logo-letter1">B</span>
        <span id="logo-letter1">a</span>
        <span id="logo-letter1">s</span>
        <span id="logo-letter1">e</span>
        <span className="text-primary-500">
          <span id="logo-letter2">C</span>
          <span id="logo-letter2">a</span>
          <span id="logo-letter2">s</span>
          <span id="logo-letter2">e</span>
        </span>
      </p>
      </Link>
    </>
  );
};

export default Logo;
