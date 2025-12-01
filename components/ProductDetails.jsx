
'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import ModalPopup from './PopupModel';
import { assets } from '@/assets/assets';

const ProductDetails = ({ product }) => {
  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const productId = product.id || product._id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  const cart = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();

  const router = useRouter();
  
  // Safely handle images
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [assets.product_img0]; // Use placeholder if no images
  
  const [mainImage, setMainImage] = useState(productImages[0] || assets.product_img0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update mainImage when product images change
  useEffect(() => {
    if (productImages && productImages.length > 0) {
      setMainImage(productImages[0]);
    }
  }, [product.images]);

  // ✅ HP options and selected state
  const hpOptions = ["0.5 HP", "1 HP", "1.5 HP", "2.0 HP"];
  const [selectedHP, setSelectedHP] = useState(hpOptions[0]);

  // Safely calculate average rating
  const ratings = product.rating && Array.isArray(product.rating) ? product.rating : [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((acc, item) => acc + (item.rating || 0), 0) / ratings.length
    : 0;

  // Calculate price and MRP based on selected HP
  const getPriceAndMrpForHP = (hpValue) => {
    if (!product) return { price: 0, mrp: 0, discount: 0 };

    let price = 0;
    let mrp = 0;
    let discount = 0;

    // Extract HP number from string (e.g., "0.5 HP" -> "0.5", "1 HP" -> "1")
    const hpNum = hpValue.replace(' HP', '').trim();

    // If product has variants, find the variant matching the selected HP
    if (product.hasVariants && product.brandVariants && Array.isArray(product.brandVariants) && product.brandVariants.length > 0) {
      // Find variant that matches the HP value
      const matchingVariant = product.brandVariants.find(variant => {
        if (variant.attributes && Array.isArray(variant.attributes)) {
          return variant.attributes.some(attr => {
            const attrValue = String(attr.attributeValue || attr.value || '').toLowerCase().trim();
            const attrName = String(attr.attributeName || attr.name || '').toLowerCase().trim();
            
            // Check if this is an HP attribute and matches
            const isHPAttribute = attrName.includes('hp') || attrName.includes('horsepower') || 
                                 attrName.includes('power') || attrName === '';
            
            if (isHPAttribute || attrName === '') {
              // Try multiple matching strategies
              return attrValue === hpNum.toLowerCase() ||
                     attrValue === hpValue.toLowerCase() ||
                     attrValue === hpValue.toLowerCase().replace(' ', '') ||
                     attrValue.includes(hpNum) ||
                     attrValue === `0.5` && hpNum === '0.5' ||
                     attrValue === `1` && hpNum === '1' ||
                     attrValue === `1.5` && hpNum === '1.5' ||
                     attrValue === `2` && hpNum === '2.0' ||
                     attrValue === `2.0` && hpNum === '2.0';
            }
            return false;
          });
        }
        return false;
      });

      if (matchingVariant) {
        // Use actual price from variant
        if (matchingVariant.price !== undefined && matchingVariant.price !== null) {
          price = Number(matchingVariant.price);
        }
        
        // Get discount from variant
        if (matchingVariant.discount !== undefined && matchingVariant.discount !== null) {
          discount = Number(matchingVariant.discount);
        }
        
        // Calculate MRP from discount if available
        if (discount > 0 && price > 0) {
          // MRP = Price / (1 - discount/100)
          mrp = Math.round(price / (1 - discount / 100));
        } else if (price > 0) {
          // If no discount, check if variant has MRP or use product.mrp
          if (matchingVariant.mrp && matchingVariant.mrp > price) {
            mrp = Number(matchingVariant.mrp);
          } else if (product.mrp && product.mrp > price) {
            mrp = Number(product.mrp);
          } else {
            // If no discount, MRP = price (no discount)
            mrp = price;
          }
        }
      } else {
        // If no matching variant found, use first variant as fallback
        const firstVariant = product.brandVariants[0];
        if (firstVariant && firstVariant.price !== undefined && firstVariant.price !== null) {
          price = Number(firstVariant.price);
          discount = Number(firstVariant.discount) || 0;
          if (discount > 0 && price > 0) {
            mrp = Math.round(price / (1 - discount / 100));
          } else {
            mrp = price;
          }
        }
      }
    }

    // If no variant found or product doesn't have variants, use base price
    if (price === 0) {
      price = Number(product.price) || 0;
      discount = Number(product.discount) || 0;
      
      // Calculate MRP from discount
      if (discount > 0 && price > 0) {
        // MRP = Price / (1 - discount/100)
        mrp = Math.round(price / (1 - discount / 100));
      } else if (product.mrp && product.mrp > price) {
        // Use MRP from product if available
        mrp = Number(product.mrp);
      } else if (price > 0) {
        // If no discount and no MRP, MRP = price (no discount)
        mrp = price;
      }
    }

    return { price, mrp, discount };
  };

  // Get current price and MRP based on selected HP - memoized to recalculate when product or selectedHP changes
  const { price: currentPrice, mrp: currentMrp } = useMemo(() => {
    return getPriceAndMrpForHP(selectedHP);
  }, [product, product?.hasVariants, product?.brandVariants, product?.price, product?.discount, product?.mrp, selectedHP]);

  // Handle HP selection change
  const handleHPChange = (hp) => {
    setSelectedHP(hp);
  };

  const addToCartHandler = () => {
    // Include selected HP option in cart data
    const { price: priceForSelectedHP } = getPriceAndMrpForHP(selectedHP);
    dispatch(addToCart({ 
      productId,
      selectedOption: selectedHP,
      price: priceForSelectedHP
    }));
  };

  const handleSendWhatsApp = ({ userName, userMobile }) => {
    const quantity = cart[productId] || 1;
    const productLink = typeof window !== 'undefined' ? window.location.href : '';

    const { price: selectedPrice } = getPriceAndMrpForHP(selectedHP);
    let message = `Hi, I'm interested in booking an enquiry for the following product:
🛍️ *Product:* ${product.name || product.title || 'Product'}
⚙️ *HP Option:* ${selectedHP}
💰 *Price:* ${currency}${selectedPrice}
📦 *Quantity:* ${quantity}
🖼️ *Product Link:* ${productLink}`;

    if (userName && userMobile) {
      message += `\n🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}`;
    }

    message += `\nPlease let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "9345795629";

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex max-lg:flex-col gap-12 max-w-7xl mx-auto my-10 px-4">
        {/* Images Section */}
        <div className="flex max-sm:flex-col-reverse gap-3 mx-auto">
          {/* Thumbnails */}
          {/* Thumbnails */}
{productImages.length > 0 && (
  <div className="flex sm:flex-col mt-2 sm:mt-0 sm:mr-2 gap-3">
    {productImages.map((image, index) => (
      <div 
        key={index} 
        onClick={() => setMainImage(productImages[index])} 
        className="flex items-center justify-center rounded-lg cursor-pointer overflow-hidden border border-gray-200 transition hover:scale-105 active:scale-95 w-14 h-14" // increased size
      >
        <Image 
          src={image} 
          alt={product.name || 'Product'} 
          width={56} 
          height={56} 
          className="object-cover w-full h-full"
          unoptimized
        />
      </div>
    ))}
  </div>
)}


          {/* Main Image */}
          {mainImage ? (
            <div className="flex justify-center items-center w-[320px] h-[430px] sm:h-[540px] sm:w-[405px] md:h-[540px] md:w-[405px] rounded-lg overflow-hidden">
              <Image 
                src={mainImage} 
                alt={product.name || 'Product'} 
                width={500} 
                height={500} 
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex justify-center items-center w-[320px] h-[430px] sm:h-[540px] sm:w-[405px] md:h-[540px] md:w-[405px] rounded-lg overflow-hidden bg-gray-100">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 mx-auto  flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">{product.name || product.title || 'Product'}</h1>
          <div className='flex items-center mt-2'>
            {Array(5).fill('').map((_, index) => (
              <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#c31e5aff" : "#D1D5DB"} />
            ))}
            <p className="text-sm ml-3 text-slate-500">{ratings.length} Reviews</p>
          </div>
          <div className="flex items-start my-6 gap-3 text-xl sm:text-2xl font-semibold text-slate-800">
            <p> {currency}{currentPrice} </p>
            {currentMrp > currentPrice && (
              <p className="text-lg sm:text-xl text-slate-500 line-through">{currency}{currentMrp}</p>
            )}
          </div>
                    {/* ✅ HP Options Section */}
          <div className="mt-1 mb-6">
            <p className="text-lg font-semibold text-slate-800 mb-2">
              Available Options:
            </p>
            <div className="flex flex-wrap gap-3">
              {hpOptions.map((hp) => {
                const { price: hpPrice } = getPriceAndMrpForHP(hp);
                return (
                  <button
                    key={hp}
                    onClick={() => handleHPChange(hp)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all
                      ${
                        selectedHP === hp
                          ? "bg-[#c31e5aff] text-white border-[#c31e5aff]"
                          : "border-gray-300 text-slate-700 hover:bg-gray-100"
                      }`}
                  >
                    {hp}
                  </button>
                );
              })}
            </div>
          </div>

          {currentMrp > currentPrice && (
            <div className="flex items-center gap-2 text-md sm:text-lg text-slate-500">
              <TagIcon size={14} />
              <p>Save {((currentMrp - currentPrice) / currentMrp * 100).toFixed(0)}% right now</p>
            </div>
          )}

         {/* <div className="flex flex-wrap items-end gap-5 mt-10">
            {cart[productId] && (
              <div className="flex flex-col gap-3">
                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                <Counter productId={productId} />
              </div>
            )}
            <button 
              onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')} 
              className="bg-slate-900 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-700 active:scale-95 transition"
            >
              {!cart[productId] ? 'Add to Cart' : 'View Cart'}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
            className="bg-[#c31e5aff] text-white px-10 py-3 text-sm font-medium rounded hover:bg-[#d44a70] active:scale-95 transition"
            >
              Book Enquiry
            </button>
          </div> */}
          <div className="flex flex-wrap items-end gap-5 mt-10">
  {cart[productId] && (
    <div className="flex flex-col gap-3 min-w-[150px] sm:min-w-[180px]">
      <p className="text-lg text-slate-800 font-semibold">Quantity</p>
      <Counter productId={productId} />
    </div>
  )}

  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
    <button
      onClick={() =>
        !cart[productId] ? addToCartHandler() : router.push('/cart')
      }
      className="flex-1 sm:flex-none bg-slate-900 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-700 active:scale-95 transition w-full sm:w-44"
    >
      {!cart[productId] ? 'Add to Cart' : 'View Cart'}
    </button>

    <button
      onClick={() => setIsModalOpen(true)}
      className="flex-1 sm:flex-none bg-[#c31e5a] text-white px-10 py-3 text-sm font-medium rounded hover:bg-[#d44a70] active:scale-95 transition w-full sm:w-44"
    >
      Book Enquiry
    </button>
  </div>
</div>


          <hr className="border-gray-300 my-5" />

          <div className="flex flex-col gap-4 text-slate-500 text-md sm:text-lg">
            <p className="flex gap-3"> <EarthIcon className="text-slate-400 " /> Free shipping worldwide </p>
            <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
            <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
          </div>
        </div>
      </div>

      <ModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={[{
          name: `${product.name || product.title || 'Product'} (${selectedHP})`,
          price: currentPrice,
          quantity: cart[productId] || 1
        }]}
        totalPrice={currentPrice * (cart[productId] || 1)}
        totalQuantity={cart[productId] || 1}
        currency={currency}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </>
  );
};

export default ProductDetails;
