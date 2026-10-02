"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ROUTES from "@/constant/routes";
import { prefersReducedMotion } from "@/lib/animation";

const tabs = [
  { label: "Home", route: ROUTES.HOME, icon: "/icons/home.svg" },
  { label: "Community", route: ROUTES.COMMUNITY, icon: "/icons/users.svg" },
  {
    label: "Ask",
    route: ROUTES.ASKQUESTION,
    icon: "/icons/question.svg",
    accent: true,
  },
  { label: "Tags", route: ROUTES.TAGS, icon: "/icons/tag.svg" },
  { label: "Jobs", route: ROUTES.JOBS, icon: "/icons/suitcase.svg" },
];

const MobileTabBar = () => {
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(barRef.current?.querySelectorAll("a") ?? [], {
        y: 24,
        opacity: 0,
        stagger: 0.04,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: barRef },
  );

  return (
    <nav
      ref={barRef}
      aria-label="Primary"
      className="background-light900_dark200 light-border fixed inset-x-0 bottom-0 z-50 border-t shadow-light-100 dark:shadow-dark-100 lg:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive =
            tab.route === ROUTES.HOME
              ? pathname === tab.route
              : pathname === tab.route ||
                pathname.startsWith(`${tab.route}/`);

          if (tab.accent) {
            return (
              <li key={tab.route} className="flex-1">
                <Link
                  href={tab.route}
                  aria-current={isActive ? "page" : undefined}
                  className="flex h-full flex-col items-center justify-center gap-1 py-2 transition-transform active:scale-95"
                >
                  <span className="primary-gradient -mt-5 flex size-11 items-center justify-center rounded-full shadow-light-200">
                    <Image
                      src={tab.icon}
                      alt=""
                      width={22}
                      height={22}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={`small-regular ${
                      isActive
                        ? "primary-text-gradient font-bold"
                        : "text-dark400_light700"
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={tab.route} className="relative flex-1">
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 mx-auto h-0.5 w-7 rounded-full bg-primary-500"
                />
              )}
              <Link
                href={tab.route}
                aria-current={isActive ? "page" : undefined}
                className="flex h-full flex-col items-center justify-center gap-1 py-2.5 transition-transform active:scale-95"
              >
                <Image
                  src={tab.icon}
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="invert-colors"
                />
                <span
                  className={`small-regular truncate px-0.5 ${
                    isActive
                      ? "font-bold text-primary-500"
                      : "text-dark400_light700"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileTabBar;
