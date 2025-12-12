"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  GITHUB_URI,
  LINKEDIN_URI,
  BETTERSTACK_URI,
} from "../../utils/Constants";
import { RiMenuLine, RiCloseFill } from "@remixicon/react";

export default function HeroSection({ user, signInUrl, signUpUrl }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const handleScroll = () => {
    const element = document.getElementById("features-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetStarted = () => {
    setLoadingButton(true);
    setTimeout(() => {
      setLoadingButton(false);
      window.location.href = signInUrl;
    }, 800);
  };

  return (
    <div className="isolate bg-white">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(120%_120%_at_50%_10%,#fff_30%,#ffab91_100%)]"></div>
      <div className="absolute h-1/2 -z-10 w-full bg-[radial-gradient(#e5e7eb_1px,transparent_2px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_100%,transparent_100%)]"></div>
      <div className="px-6 pt-6">
        <nav className="flex items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1 items-center">
            <a href="/" className="-m-1.5 p-1.5">
              <img className="h-6" src="/demoday.svg" alt="demoday-ai" />
            </a>
            <h4 className="ml-2 text-gray-900 sm:text-xl font-medium">
              DemoDay AI
            </h4>
          </div>
          <div className="flex lg:hidden gap-4">
            <div
              className="p-1 pr-3 pl-3 rounded-full cursor-pointer"
              style={{ backgroundColor: "var(--brand-secondary)" }}
            >
              <Link
                href={signInUrl}
                className="text-sm font-semibold leading-6 text-white"
              >
                Join DemoDay AI
              </Link>
            </div>
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <RiMenuLine className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a
              href={GITHUB_URI}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Github
            </a>
            <a
              onClick={handleScroll}
              className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
            >
              Features
            </a>
            <a
              href={BETTERSTACK_URI}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Status
            </a>
            <a
              href={LINKEDIN_URI}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Contact
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div className="flex gap-4 justify-center items-center">
              <Link
                href={signInUrl}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in
              </Link>
              <Link href={signUpUrl}>
                <div
                  className="p-1 pr-3 pl-3 rounded-full cursor-pointer"
                  style={{ backgroundColor: "var(--brand-secondary)" }}
                >
                  <p className="text-sm font-semibold leading-6 text-white ">
                    Join DemoDay AI
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <Dialog.Panel
            focus="true"
            className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <img className="h-8" src="/demoday.svg" alt="" />
              </a>
              <h4 className="ml-2 text-gray-900 sm:text-2xl">DemoDay AI</h4>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <RiCloseFill className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    href={GITHUB_URI}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                  >
                    Github
                  </a>
                  <a
                    onClick={handleScroll}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10 cursor-pointer"
                  >
                    Features
                  </a>
                  <a
                    href={BETTERSTACK_URI}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                  >
                    Status
                  </a>
                  <a
                    href={LINKEDIN_URI}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                  >
                    Contact
                  </a>
                </div>
                <div className="py-6">
                  <Link
                    href={signInUrl}
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-white"
                  >
                    Join DemoDay AI
                  </Link>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
      <main>
        <div className="relative py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Practice Your Pitch, Elevate Your Impact <br /> and Secure Your
                Success.
              </h1>

              <p className="mt-6 text-xs sm:text-lg leading-8 text-gray-600">
                Sharpen your pitch with real-time AI voice feedback trained on
                <br /> YCombinator startup knowledge and investor insights.
              </p>
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              {loadingButton && (
                <Button
                  className="text-white"
                  style={{ backgroundColor: "var(--brand-secondary)" }}
                  disabled
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Get Started
                </Button>
              )}
              {!loadingButton && (
                <Button
                  style={{ backgroundColor: "var(--brand-secondary)" }}
                  onClick={handleGetStarted}
                  className="cursor-pointer"
                >
                  Get Started
                </Button>
              )}

              <a
                href={GITHUB_URI}
                className="text-base font-semibold leading-7"
              >
                Learn more <span>→</span>
              </a>
            </div>
            <div className="mt-20 flow-root sm:mt-16">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="/banner.webp"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <div id="features-section"></div>
    </div>
  );
}
