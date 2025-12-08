'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React,{useState,useEffect, useCallback} from 'react'
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion'

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      image: assets.banner1,
      title: "Your Solution for Consistent and Efficient Pumping",
      subtitle: "Built for performance and durability",
      cta: "Explore Products"
    },
    {
      image: assets.banner2,
      title: "Engineered for Durability and Long Working Hours",
      subtitle: "Save more with our advanced motor technology",
      cta: "Shop Now"
    },
    {
      image: assets.banner3,
      title: "Delivers Consistent Performance Under Heavy-Duty Operations",
      subtitle: "Engineered for industrial and domestic use",
      cta: "View Collection"
    },
  ];
  
  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto slide every 5 seconds - only after mount and when not hovered
  useEffect(() => {
    if (!mounted || isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted, isHovered, slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

    return (
        <section className='bg-white relative overflow-hidden'>
            {/* Hero Banner Section - Full Width with Professional Design */}
            <div 
                className='w-full relative'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative w-full overflow-hidden">
                    {/* Slide Images with Smooth Transitions */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px]"
                        >
                            {/* Background Image Layer - Bottom Layer (z-0) */}
        <Image
          src={mounted ? slides[current].image : slides[0].image}
          alt={mounted ? slides[current].title : slides[0].title}
                                fill
          priority
                                className="object-cover z-0"
                            />
                            
                            {/* Professional Gradient Overlay - Middle Layer (z-10) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 z-10 pointer-events-none"></div>
                            
                            {/* Content Container - Top Layer (z-[60] to be above navbar z-50) */}
                            <div className="absolute inset-0 z-[60] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
                                <div className="h-full flex flex-col justify-center items-start">
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="max-w-2xl text-white pointer-events-auto"
                                    >
                                        <motion.h1 
                                            key={`title-${current}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight tracking-tight text-white drop-shadow-2xl"
                                        >
                                            {mounted ? slides[current].title : slides[0].title}
                                        </motion.h1>
                                        
                                        <motion.p 
                                            key={`subtitle-${current}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1, duration: 0.5 }}
                                            className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 max-w-xl leading-relaxed drop-shadow-lg"
                                        >
                                            {mounted ? slides[current].subtitle : slides[0].subtitle}
                                        </motion.p>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.5 }}
                                        >
                                            <Link href="/category/products">
                                                <button className="group bg-[#7C2A47] hover:bg-[#7C2A47]/90 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
                                                    <span>{mounted ? slides[current].cta : slides[0].cta}</span>
                                                    <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Navigation Arrows - Top Layer (z-[60] to be above navbar) */}
                            {mounted && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-300 z-[60] group"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft size={20} className="text-white group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-300 z-[60] group"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight size={20} className="text-white group-hover:scale-110 transition-transform" />
                                    </button>
                                </>
                            )}

                            {/* Professional Navigation Dots - Top Layer (z-[60] to be above navbar) */}
      {mounted && (
                                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-[60]">
          {slides.map((_, index) => (
            <button
              key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`rounded-full transition-all duration-300 ${
                                                current === index 
                                                    ? "bg-white w-8 h-2.5" 
                                                    : "bg-white/40 hover:bg-white/60 w-2.5 h-2.5"
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
          ))}
        </div>
      )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Promotional Cards Section - Professional Grid Layout */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <div className='grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6'>
                    {/* Best Products Card */}
                    <Link href="/category/products" className="group">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className='relative flex items-center justify-between bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-2xl transition-all duration-300 border border-emerald-200/60 overflow-hidden'
                        >
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-600 rounded-full blur-2xl"></div>
                </div>

                            <div className="relative z-10 flex-1">
                                <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500 bg-clip-text text-transparent mb-2 sm:mb-3'>
                                    Best Products
                                </h3>
                                <p className='text-sm sm:text-base text-emerald-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all'>
                                    Explore Collection
                                    <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                                </p>
                            </div>
                            <div className="relative z-10 flex-shrink-0 ml-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-white/90 p-2.5 shadow-xl transition-all duration-300">
                                    <Image 
                                        className='w-full h-full object-contain' 
                                        src={assets.product_img2} 
                                        alt="Best Products" 
                                        width={128}
                                        height={128}
                                    />
                                </div>
                        </div>
                        </motion.div>
                    </Link>

                    {/* Discount Card */}
                    <Link href="/category/products" className="group">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className='relative flex items-center justify-between bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-2xl transition-all duration-300 border border-blue-200/60 overflow-hidden'
                        >
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-600 rounded-full blur-2xl"></div>
                    </div>

                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                        20%
                                    </span>
                                    <span className="text-base sm:text-lg font-semibold text-blue-700">OFF</span>
                                </div>
                                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-blue-800 mb-2 sm:mb-3'>
                                    Special Discounts
                                </h3>
                                <p className='text-sm sm:text-base text-blue-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all'>
                                    Shop Now
                                    <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                                </p>
                            </div>
                            <div className="relative z-10 flex-shrink-0 ml-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-white/90 p-2.5 shadow-xl transition-all duration-300">
                                    <Image 
                                        className='w-full h-full object-contain' 
                                        src={assets.product_img6} 
                                        alt="Discounts" 
                                        width={128}
                                        height={128}
                                    />
                        </div>
                    </div>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </section>


    )
}

export default Hero
