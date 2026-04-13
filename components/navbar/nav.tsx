"use client";

import Link from "next/link";
import React from "react";
import {cn} from "@/lib/utils";
import {useScroll} from "motion/react";
import {usePathname} from "next/navigation";
import {AnimatedThemeToggler} from "../ui/animated-theme-toggler";
import {sans} from "@/lib/fonts";
import Image from "next/image";

export const Navbar = ({user}: {user?: any}) => {
  const pathname = usePathname();
  const {scrollYProgress} = useScroll();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-200 ",
          scrolled && "bg-white/80 backdrop-blur-5xl",
        )}
      >
        <div className="w-full px-3.5 md:px-0 pt-5">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between gap-3 py-3 lg:py-4">
              <div className="flex items-center gap-10 md:gap-16">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center grayscale-0 md:grayscale-50 scale-x-70 md:scale-x-100"
                >
                  <Image
                    className="flex items-center grayscale-0 md:grayscale-50 scale-x-70 md:scale-x-100"
                    src={
                      "https://ik.imagekit.io/mrityunjay/DocuMind/teach__4_-removebg-preview.png"
                    }
                    alt="logo"
                    width={100}
                    height={100}
                  />
                </Link>

                <ul className="flex gap-3 sm:gap-4 md:gap-8 text-[12.5px] md:text-sm">
                  {user && (
                    <>
                      <li className="relative pb-1">
                        <Link
                          href="/dashboard"
                          className={cn(
                            "group relative block transition-colors duration-150",
                            sans.className,
                            pathname === "/dashboard"
                              ? "font-semibold"
                              : "hover:text-accent-foreground",
                          )}
                        >
                          <span>Summaries</span>
                          <span
                            className={cn(
                              "absolute left-0 -bottom-1 h-[1.5px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100",
                              pathname === "/dashboard" && "scale-x-100",
                            )}
                          />
                        </Link>
                      </li>
                      <li className="relative pb-1">
                        <Link
                          href="/upload"
                          className={cn(
                            "group relative block transition-colors duration-150",
                            sans.className,
                            pathname === "/upload"
                              ? "font-semibold"
                              : "hover:text-accent-foreground",
                          )}
                        >
                          <span>Upload PDF</span>
                          <span
                            className={cn(
                              "absolute left-0 -bottom-1 h-[1.5px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100",
                              pathname === "/upload" && "scale-x-100",
                            )}
                          />
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 pb-1">
                {user ? (
                  <div className="flex items-center gap-1">
                    {user?.user?.image && (
                      <Image
                        src={user.user.image}
                        alt="Profile"
                        width={28}
                        height={28}
                        className="rounded-full flex-shrink-0 border border-border"
                      />
                    )}
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    className="text-[12.5px] md:text-sm font-medium hover:text-foreground/80 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                <AnimatedThemeToggler />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
