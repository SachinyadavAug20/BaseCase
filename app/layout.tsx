import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const inter = localFont({
  src: "./fonts/interFont.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const diff = localFont({
  src: "./fonts/diff.ttf",
  variable: "--font-diff",
  weight: "100 200 300 400 500 600 700 800 900",
});

const logofont = localFont({
  src: "./fonts/logofont.ttf",
  variable: "--font-logofont",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "BaseCase",
  description:"BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.className,
        diff.variable,
        logofont.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
};
export default RootLayout;
