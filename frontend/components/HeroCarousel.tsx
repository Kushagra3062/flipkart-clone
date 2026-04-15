"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  "/banners/electronics.png",
  "/banners/fashion.png",
  "/banners/mobiles.png",
  "/banners/appliances.png"
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current === BANNERS.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideNext = () => setIndex((i) => (i === BANNERS.length - 1 ? 0 : i + 1));
  const slidePrev = () => setIndex((i) => (i === 0 ? BANNERS.length - 1 : i - 1));

  return (
    <div className="relative w-full max-w-[1240px] mx-auto mt-2 bg-white shadow-sm overflow-hidden min-h-[140px] md:min-h-[200px] lg:min-h-[220px]">
      <div className="absolute inset-0 flex">
        <AnimatePresence initial={false}>
          {BANNERS.map((banner, i) => (
            i === index && (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={banner}
                  alt="Promo Banner"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover md:object-fill"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button 
        onClick={slidePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 shadow text-gray-800 p-3 lg:p-6 lg:py-8 rounded-r-[4px] hover:bg-white transition"
      >
        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      <button 
        onClick={slideNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 shadow text-gray-800 p-3 lg:p-6 lg:py-8 rounded-l-[4px] hover:bg-white transition"
      >
        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {BANNERS.map((_, i) => (
          <div 
            key={i} 
            className={`transition-all duration-300 rounded-full bg-white shadow-md ${i === index ? "w-6 h-1.5" : "w-1.5 h-1.5 opacity-60"}`}
          />
        ))}
      </div>
    </div>
  );
}
