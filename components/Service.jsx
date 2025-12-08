'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { assets } from '@/assets/assets'
import Title from './Title'
import { motion } from 'framer-motion'

const applications = [
  { label: 'Agriculture', src: assets.agri },
  { label: 'Building Services', src: assets.build },
  { label: 'Waste Water Solutions', src: assets.wastewater },
  { label: 'Solar Pumps', src: assets.solar },
  { label: 'Domastic Pumps', src: assets.home },
]

const itemsPerPageMobile = 2
const itemsPerPageTablet = 3
const itemsPerPageDesktop = 5

export default function PumpApplications() {
  const [mobileIndex, setMobileIndex] = useState(0)
  const [tabletIndex, setTabletIndex] = useState(0)

  const handleMobileNext = () => {
    if (mobileIndex + itemsPerPageMobile < applications.length) {
      setMobileIndex(mobileIndex + itemsPerPageMobile)
    }
  }

  const handleMobilePrev = () => {
    if (mobileIndex - itemsPerPageMobile >= 0) {
      setMobileIndex(mobileIndex - itemsPerPageMobile)
    }
  }

  const handleTabletNext = () => {
    if (tabletIndex + itemsPerPageTablet < applications.length) {
      setTabletIndex(tabletIndex + itemsPerPageTablet)
    }
  }

  const handleTabletPrev = () => {
    if (tabletIndex - itemsPerPageTablet >= 0) {
      setTabletIndex(tabletIndex - itemsPerPageTablet)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
      <Title
        title={`Precision Engineering For a Better World`}
        description="Discover our range of innovative solutions"
        href={`/category/products`}
      />

      {/* --- Mobile Carousel (below md: 768px) --- */}
      <div className="md:hidden relative flex items-center justify-between w-full px-8 mt-4">
        <button
          onClick={handleMobilePrev}
          disabled={mobileIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2.5 rounded-full z-20 transition-all ${
            mobileIndex === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'opacity-100 hover:bg-gray-50 active:scale-95'
          }`}
          aria-label="Previous items"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full snap-x snap-mandatory scrollbar-hide touch-pan-y touch-pan-x">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-3"
            style={{ transform: `translateX(-${mobileIndex * (100 / itemsPerPageMobile)}%)` }}
          >
            {applications.map((app, index) => (
              <Link
                key={index}
                href="/category/products"
                className="group flex-shrink-0 w-1/2 flex flex-col snap-start"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="bg-gray-50 rounded-lg h-32 w-full flex items-center justify-center overflow-hidden mb-3">
                    <Image
                      src={app.src}
                      alt={app.label}
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <p className="text-center text-sm font-semibold text-gray-800">{app.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleMobileNext}
          disabled={mobileIndex + itemsPerPageMobile >= applications.length}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2.5 rounded-full z-20 transition-all ${
            mobileIndex + itemsPerPageMobile >= applications.length
              ? 'opacity-30 cursor-not-allowed'
              : 'opacity-100 hover:bg-gray-50 active:scale-95'
          }`}
          aria-label="Next items"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* --- Tablet Carousel (md: 768px to lg: 1023px) --- */}
      <div className="hidden md:block lg:hidden relative flex items-center justify-between w-full mt-8">
        <button
          onClick={handleTabletPrev}
          disabled={tabletIndex === 0}
          className={`absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-3 rounded-full z-10 transition-all ${
            tabletIndex === 0 ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50 active:scale-95'
          }`}
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full snap-x snap-mandatory scrollbar-hide touch-pan-y touch-pan-x">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{ transform: `translateX(-${tabletIndex * (100 / itemsPerPageTablet)}%)` }}
          >
            {applications.map((app, index) => (
              <Link
                key={index}
                href="/category/products"
                className="group flex-shrink-0 w-1/3 flex flex-col snap-start"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="bg-gray-50 rounded-lg h-40 w-full flex items-center justify-center overflow-hidden mb-4">
                    <Image
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                      src={app.src}
                      alt={app.label}
                      width={140}
                      height={140}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <p className="text-center font-semibold text-base text-gray-800">{app.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleTabletNext}
          disabled={tabletIndex + itemsPerPageTablet >= applications.length}
          className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-3 rounded-full z-10 transition-all ${
            tabletIndex + itemsPerPageTablet >= applications.length
              ? 'opacity-40 pointer-events-none'
              : 'hover:bg-gray-50 active:scale-95'
          }`}
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* --- Desktop Grid (lg: 1024px and above) - Myntra Style --- */}
      <div className="hidden lg:grid mt-6 grid-cols-5 gap-4">
        {applications.map((app, index) => (
          <Link
            key={index}
            href="/category/products"
            className="group"
          >
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              <div className="bg-gray-50 rounded-lg h-48 w-full flex items-center justify-center overflow-hidden mb-4">
                <Image
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  src={app.src}
                  alt={app.label}
                  width={160}
                  height={160}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <p className="font-semibold text-center text-base text-gray-800 group-hover:text-[#c31e5aff] transition-colors">
                {app.label}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  )
}
