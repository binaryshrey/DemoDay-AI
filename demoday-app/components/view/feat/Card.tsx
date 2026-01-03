"use client";

import { useTransform, motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { LucideIcon, CircleCheckBig } from "lucide-react";
import Image from "next/image";

interface CardProps {
  i: number;
  name: string;
  description: string;
  details: Array<{
    title: string;
    text: string;
  }>;
  icon: LucideIcon;
  color: string;
  image: string;
  progress: any;
  range: [number, number];
  targetScale: number;
}

const Card = ({
  i,
  name,
  description,
  details,
  icon: Icon,
  color,
  image,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const iconScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0 px-4 lg:px-6"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative flex w-full h-172 rounded-3xl p-8 lg:p-12 origin-top gap-12"
      >
        {/* Left side - Text content */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center gap-6">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
            {name}
          </h3>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            {description}
          </h2>

          {/* Feature list items */}
          <div className="space-y-4 mt-2">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3">
                <CircleCheckBig
                  className="w-5 h-5 text-white shrink-0 mt-1"
                  strokeWidth={2}
                />
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">
                    {detail.title}
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {detail.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block w-[60%] relative rounded-3xl overflow-hidden">
          <div className="w-full h-full relative">
            <Image src={image} alt={name} fill className="object-contain" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
