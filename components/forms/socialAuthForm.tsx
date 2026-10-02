"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import ROUTES from "@/constant/routes";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { MOTION, prefersReducedMotion } from "@/lib/animation";

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900! SocialAuthbtn text-dark500_light700! body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".SocialAuthbtn", {
        opacity: 0,
        y: 20,
        scale: 0.97,
        stagger: 0.07,
        duration: 0.35,
        ease: MOTION.ease,
        clearProps: "all",
      });
    },
    { scope: containerRef },
  );
  const handleSignIn = async (provider: "github" | "google" | "apple") => {
    try {
      if (provider === "apple") {
        toast.error("Not implemented yet", {
          position: "top-center",
          description: "apple auth is not implemented yet",
        });
      }
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
      });
    } catch (error) {
      console.log(error);
      toast.error(`Sign-in Failed!`, {
        position: "top-right",
        description: `Error: ${error}`,
      });
    }
  };

  return (
    <div
      className="mt-10 flex flex-wrap gap-2.5 opacity-100"
      ref={containerRef}
    >
      <Button
        className={buttonClass}
        onClick={() => {
          handleSignIn("github");
        }}
      >
        <Image
          src="icons/github.svg"
          alt="Github"
          width={20}
          height={20}
          className="inverted-colors mr-2.5 object-contain"
        />
        <span>Log in with Github</span>
      </Button>
      <Button
        className={buttonClass}
        onClick={() => {
          handleSignIn("google");
        }}
      >
        <Image
          src="icons/google.svg"
          alt="Github"
          width={20}
          height={20}
          className="mr-2.5 object-contain" /> <span>Log in with Google</span>
      </Button>
      <Button
        className={buttonClass}
        onClick={() => {
          handleSignIn("apple");
        }}
      >
        <Image
          src="icons/apple.svg"
          alt="Github"
          width={20}
          height={20}
          className="inverted-colors mr-2.5 object-contain"
        />
        <span>Log in with Apple</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
