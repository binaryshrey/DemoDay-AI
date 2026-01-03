"use client";

import Link from "next/link";

const CTA = ({ signInUrl }: { signInUrl: string }) => {
  return (
    <div className="bg-white pt-20">
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-48 sm:py-48 lg:py-56">
          <div className="text-center">
            <h4 className="text-md font-bold  text-gray-900 sm:text-3xl">
              Practice your pitch like it’s demo day.
            </h4>
            <h4 className="text-md font-bold  text-gray-900 sm:text-3xl">
              Powered by voice agents and investor grade AI.
            </h4>
            <p className="mt-6 text-xs leading-5 text-gray-600">
              Run pitch simulations, answer real investor questions and get
              actionable feedback powered by Gemini and ElevenLabs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={signInUrl}
                className="rounded-md bg-[#FF6632] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF6632] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5319]"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
