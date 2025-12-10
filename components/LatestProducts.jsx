'use client';
import Title from './Title';
import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync } from '@/lib/features/product/productSlice';
import { assets } from '@/assets/assets';

const LatestProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const displayQuantity = 4; // Number of products to show in grid on desktop
  const tabletDisplayQuantity = 2; // Number of products to show in grid on tablet

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  // Detect screen size
  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Handlers for carousel
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (max) => {
    setCurrentIndex((prev) => Math.min(max - 1, prev + 1));
  };

  // Transform and filter products
  const transformedProducts = products && Array.isArray(products) && products.length > 0
    ? products
        .filter(product => product.status === 'active') // Only show active products
        .map(product => {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          
          // Handle images - ensure we always have at least one image (placeholder)
          let productImages = [];
          if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            productImages = product.images
              .filter(img => img && img.trim() !== '') // Filter out empty strings
              .map(img => {
                if (img.startsWith('http')) return img;
                // Handle both full paths and relative paths
                return img.startsWith('/uploads/') ? `${baseUrl}${img}` : `${baseUrl}/uploads/${img}`;
              });
          }
          
          // If no valid images, use placeholder from assets
          if (productImages.length === 0) {
            productImages = [assets.product_img0]; // Use default placeholder image
          }
          
          return {
            id: product.id || product._id,
            name: product.title || product.name || 'Untitled Product',
            images: productImages,
            price: product.price || 0,
            category: product.category || '',
            createdAt: product.createdAt || product.created_at || new Date(),
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by creation date (newest first)
        .slice(0, 12) // Limit to 12 latest products
    : [];

  const sortedProducts = transformedProducts;

  // Determine width class based on screen size
  const getWidthClass = () => {
    if (isMobile) return 'w-full';
    if (isTablet) return 'w-1/2';
    return 'w-1/4';
  };

  // Determine translate percentage based on screen size
  const getTranslatePercentage = () => {
    if (isMobile) return 100;
    if (isTablet) return 50;
    return 25;
  };

  return (
    <div className="px-4 sm:px-6 my-20 max-w-7xl mx-auto">
      <Title
        title="Latest Products"
        description="Explore our newest arrivals"
        visibleButton={true}
        href="/category/products"
      />

      {/* Loading State */}
      {loading && sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      )}

      {/* Carousel for all screen sizes */}
      {sortedProducts.length > 0 && (
      <div className="relative -mx-2 mt-6">
        <div className="overflow-x-auto scrollbar-hide pb-8">
          <div
            className="flex transition-transform duration-500 ease-in-out snap-x snap-mandatory"
            style={{ transform: `translateX(-${currentIndex * getTranslatePercentage()}%)` }}
          >
            {sortedProducts.map((product, i) => (
              <div
                  key={product.id || i}
                className={`flex-none ${getWidthClass()} snap-start px-2`}
                style={{ flexShrink: 0 }}
              >
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {sortedProducts.length > (isMobile ? 1 : isTablet ? tabletDisplayQuantity : displayQuantity) && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute top-58 sm:top-47 left-2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 disabled:opacity-50 z-20"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <button
              onClick={() => handleNext(sortedProducts.length)}
              disabled={currentIndex >= sortedProducts.length - (isMobile ? 1 : isTablet ? tabletDisplayQuantity : displayQuantity)}
              className="absolute top-58 sm:top-47 right-2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 disabled:opacity-50 z-20"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </>
        )}
      </div>
      )}
    </div>
  );
};

export default LatestProducts;