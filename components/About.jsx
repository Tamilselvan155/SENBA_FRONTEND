'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import WVlogo from "@/assets/YUCHII LOGO.png";

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  return (
    <div className="w-full bg-gray-50 text-[#3A3634]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Logo and About Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full md:w-auto flex justify-center md:justify-start"
          >
            <Image 
              src={WVlogo} 
              alt="Senba Pumps & Motors" 
              width={300} 
              height={200}
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:max-w-[350px] h-auto object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full md:w-auto"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7C2A47] mb-4 sm:mb-6 text-center md:text-left">
              About <span className="text-[#E6A02A]">Senba Pumps & Motors</span>
            </h1>
            <div className="space-y-4 sm:space-y-5">
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 text-center md:text-left">
                At <strong className="text-[#7C2A47]">Senba Pumps & Motors</strong>, we are committed to delivering reliable
                and energy-efficient pumping solutions for all your industrial and domestic needs.
                With decades of experience and a focus on quality craftsmanship, our products stand
                for durability and trust.
              </p>

              <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 text-center md:text-left">
                Our mission is to empower every customer with sustainable and innovative motor
                technologies that ensure long-term performance and efficiency.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Statistics Section */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 text-center">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#7C2A47] leading-tight">
              {inView && <CountUp end={5000} duration={3} />}
              <sup className="text-[#E6A02A] text-2xl sm:text-3xl lg:text-4xl ml-1">+</sup>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mt-3 sm:mt-4 text-gray-700 font-medium">
              Total Products
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#7C2A47] leading-tight">
              {inView && <CountUp end={1200} duration={3} />}
              <sup className="text-[#E6A02A] text-2xl sm:text-3xl lg:text-4xl ml-1">+</sup>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mt-3 sm:mt-4 text-gray-700 font-medium">
              Exclusive Dealers
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#7C2A47] leading-tight">
              {inView && <CountUp end={800} duration={3} />}
              <sup className="text-[#E6A02A] text-2xl sm:text-3xl lg:text-4xl ml-1">+</sup>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mt-3 sm:mt-4 text-gray-700 font-medium">
              Pumps Sold / Day
            </p>
          </div>
        </div>
      </div>

      {/* Footer Slogan Section */}
      <div className="w-full bg-[#7C2A47] py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
            Quality • Trust • Service
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90">
            Driven by performance, powered by integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
