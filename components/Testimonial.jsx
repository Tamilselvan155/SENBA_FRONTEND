
'use client';
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { dummyRatingsData } from "@/assets/assets";

const Testimonial = () => {
  const [current, setCurrent] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [mounted, setMounted] = useState(false);

  // ✅ Responsive: Update visibleCards based on screen width
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxStart = useMemo(() => Math.max(0, dummyRatingsData.length - visibleCards), [visibleCards]);

  const prev = useCallback(() => {
    setCurrent((v) => Math.max(0, v - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((v) => Math.min(maxStart, v + 1));
  }, [maxStart]);

  const showing = useMemo(() => 
    dummyRatingsData.slice(current, current + visibleCards),
    [current, visibleCards]
  );

  // Reset to first card when visibleCards changes
  useEffect(() => {
    setCurrent(0);
  }, [visibleCards]);

  if (!mounted) {
    return (
      <section className="w-full py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-400">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We value every piece of feedback — here's what our happy customers have to say!
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative px-12 sm:px-14 md:px-16 lg:px-20">
          {/* Left Arrow */}
          <button
            className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous testimonial"
          >
            <ChevronLeft
              size={18}
              className={`${current === 0 ? "text-gray-300" : "text-gray-700"}`}
            />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div className="flex gap-4 sm:gap-5 md:gap-6 justify-center transition-all duration-300 ease-in-out">
              {showing.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center flex-shrink-0 w-full sm:w-[calc(50%-0.625rem)] md:w-[calc(33.333%-1rem)] lg:w-[320px] max-w-[320px] p-4 sm:p-5 md:p-6"
                >
                  {/* User Image */}
                  <div className="mb-3 sm:mb-4">
                    <Image
                      src={item.user.image}
                      alt={item.user.name}
                      className="rounded-full object-cover"
                      width={64}
                      height={64}
                      style={{
                        width: '64px',
                        height: '64px',
                      }}
                    />
                  </div>

                  {/* User Name */}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                    {item.user.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          i < Math.round(item.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-600 font-medium">
                      ({item.rating})
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed line-clamp-4 sm:line-clamp-5 flex-grow">
                    "{item.review}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={next}
            disabled={current === maxStart}
            aria-label="Next testimonial"
          >
            <ChevronRight
              size={18}
              className={current === maxStart ? "text-gray-300" : "text-gray-700"}
            />
          </button>
        </div>

        {/* Navigation Dots (Mobile) */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 md:hidden">
          {Array.from({ length: Math.ceil(dummyRatingsData.length / visibleCards) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index * visibleCards)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(current / visibleCards) === index
                  ? "bg-[#7C2A47] w-6"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;