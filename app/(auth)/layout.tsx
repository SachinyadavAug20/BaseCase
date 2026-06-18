import SocialAuthForm from "@/components/forms/socialAuthForm";
import Logo from "@/components/navigation/navbar/logo";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Auth | BaseCase",
  description:
    "BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen min-w-full items-center justify-center bg-(image:--bg-auth-light) dark:bg-(image:--bg-auth-dark) bg-center bg-no-repeat bg-cover px-4 py-8">
      <section className="light-border background-light800_dark200 opacity-[98.9%] shadow-light-100 min-w-full rounded-[10px] px-4 border py-10 sm:min-w-[50%] sm:px-8">
        <div className="flex pb-5 items-center justify-center gap-2">
          <Logo />
          <div className="space-y-2.5">
            <p className="paragraph-regular text-dark500_light400">
              To get your question answered
            </p>
          </div>
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default layout;
