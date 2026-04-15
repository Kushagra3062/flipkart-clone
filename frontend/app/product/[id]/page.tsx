"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingCart, Zap, Heart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import { Product } from "@/components/ProductCard";
import Skeleton from "@/components/Skeleton";
import { use } from "react";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState("");
  const { addToCart, items, fetchCart } = useCartStore();
  const { isLoggedIn, token } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = isInWishlist(id);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/v1/products/${id}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          const primary = res.data.images.find((i: any) => i.is_primary) || res.data.images[0];
          setActiveImage(primary.image_url);
        }
      } catch (e) {
        console.error("Failed executing endpoint", e);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
     if(items.find(i => i.product.id === id)) {
         setIsAdded(true);
     }
  }, [items, id]);

  const handleAddToCart = () => {
      addToCart(id, 1);
      setIsAdded(true);
  };

  const handleBuyNow = async () => {
      if (!isLoggedIn) {
          router.push(`/login?redirect=/checkout`);
          return;
      }
      // Add to cart if not already present
      if (!isAdded) {
          await addToCart(id, 1);
      }
      router.push("/checkout");
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn || !token) return;
    await toggleWishlist(id);
  };

  if (!product) return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1240px] mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="bg-white flex flex-col lg:flex-row shadow-sm min-h-[600px] animate-pulse">
          <div className="w-full lg:w-[42%] p-6 border-r border-gray-100 flex flex-col gap-4">
             <Skeleton variant="rect" width="100%" height={400} />
             <div className="flex gap-2">
                {[1,2,3,4].map(i => <Skeleton key={i} variant="rect" width="100%" height={64} />)}
             </div>
             <div className="flex gap-3 mt-8">
                <Skeleton variant="rect" width="100%" height={56} />
                <Skeleton variant="rect" width="100%" height={56} />
             </div>
          </div>
          <div className="flex-1 p-8 space-y-6">
             <Skeleton variant="text" width="90%" height={32} />
             <Skeleton variant="text" width="40%" height={24} />
             <div className="flex gap-4">
                <Skeleton variant="rect" width="100px" height={40} />
                <Skeleton variant="rect" width="80px" height={40} />
             </div>
             <Skeleton variant="rect" width="100%" height={100} />
             <div className="space-y-4 pt-10">
                <Skeleton variant="text" width="20%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="50%" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1240px] mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="bg-white flex flex-col lg:flex-row shadow-[0_1px_1px_0_rgba(0,0,0,.16)] min-h-[600px]">
          
          {/* Left Column: Visuals */}
          <div className="w-full lg:w-[42%] flex flex-col items-center p-4 sm:p-6 border-r border-[#f0f0f0]">
            <div className="w-full relative aspect-square border border-[#f0f0f0] flex justify-center items-center rounded-sm">
              <Image src={activeImage} alt={product.name} fill className="object-contain p-4" priority sizes="(max-width: 768px) 100vw, 400px" />
              {isLoggedIn && (
                <button 
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 p-2.5 bg-white shadow-[0_2px_10px_0_rgba(0,0,0,.1)] border border-gray-100 rounded-full z-10 transition hover:scale-110 active:scale-95 group"
                >
                  <Heart className={`w-5 h-5 transition ${isWishlisted ? 'fill-[#ff4343] text-[#ff4343]' : 'text-gray-300 group-hover:text-gray-400'}`} />
                </button>
              )}
            </div>
            <div className="flex gap-2.5 mt-5 overflow-x-auto w-full no-scrollbar px-1 pb-2">
              {product.images?.map((img: any, idx: number) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setActiveImage(img.image_url)}
                  className={`w-[64px] h-[64px] min-w-[64px] border-2 relative cursor-pointer hover:border-primary transition ${activeImage === img.image_url ? 'border-primary' : 'border-gray-200'}`}
                >
                   <Image src={img.image_url} alt="thumbnail fragment" fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex gap-3 w-full">
               <button 
                onClick={handleAddToCart} 
                disabled={isAdded}
                className={`flex-1 ${isAdded ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff9f00] hover:bg-[#e89000]'} text-white py-[18px] rounded-[2px] font-bold text-[16px] shadow-[0_1px_2px_0_rgba(0,0,0,.2)] tracking-wide flex items-center justify-center gap-2 transition duration-300`}
               >
                 <ShoppingCart className="w-5 h-5"/> {isAdded ? "ADDED TO CART" : "ADD TO CART"}
               </button>
               <button 
                onClick={handleBuyNow}
                className="flex-1 bg-accent hover:bg-[#eb5a13] text-white py-[18px] rounded-[2px] font-bold text-[16px] shadow-[0_1px_2px_0_rgba(0,0,0,.2)] tracking-wide flex items-center justify-center gap-2 transition duration-300"
               >
                 <Zap className="w-[22px] h-[22px] fill-current pr-0.5"/> BUY NOW
               </button>
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="w-full lg:w-[58%] p-5 sm:p-8">
             <h1 className="text-[18px] sm:text-[22px] text-[#212121] leading-snug mb-2 font-[400]">{product.name}</h1>
             
             <div className="flex items-center gap-2 mb-5">
               <div className="bg-[#388e3c] text-white text-[12px] font-bold px-1.5 py-[2px] rounded-[3px] flex items-center gap-1 w-fit">
                 {Number(product.rating || 0).toFixed(1)} <Star className="w-[10px] h-[10px] fill-current" />
               </div>
               <span className="text-[#878787] font-[500] text-[14px]">{(Number(product.rating_count || 0)).toLocaleString()} Ratings & Reviews</span>
             </div>

             <div className="flex items-end gap-3 sm:gap-4 mb-6">
                <span className="text-[28px] sm:text-[32px] font-[500] text-[#212121] leading-none mb-1">₹{(Number(product.price || 0)).toLocaleString('en-IN')}</span>
                <span className="text-[16px] text-[#878787] line-through leading-none pb-2">₹{(Number(product.mrp || 0)).toLocaleString('en-IN')}</span>
                <span className="text-[16px] font-[500] text-[#388e3c] leading-none tracking-tight pb-2">{Math.round(product.discount_percent || 0)}% off</span>
             </div>

             {/* Authentic Details Wrapper */}
             <div className="mb-6 rounded-sm bg-[#fafafa] flex flex-col gap-1 p-2 sm:p-4 border border-gray-100 shadow-sm">
                <span className="text-[14px] font-[500] text-gray-800 mb-1 flex items-center gap-2">
                   <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.3 1H1.7c-.4 0-.7.3-.7.7v12.6c0 .4.3.7.7.7h12.6c.4 0 .7-.3.7-.7V1.7c0-.4-.3-.7-.7-.7zm-1.1 11.2H2.8V2.8h10.4v9.4z" fill="#2874F0"/><path d="M10.8 5.4H5.2c-.2 0-.4.2-.4.4v2.7c0 .2.2.4.4.4h5.6c.2 0 .4-.2.4-.4V5.8c0-.2-.2-.4-.4-.4z" fill="#2874F0"/></svg>
                   Available offers
                </span>
                <ul className="text-[14px] text-[#212121] flex flex-col gap-2 ml-5">
                   <li className="flex gap-2">
                      <span className="text-[#388e3c] rounded-full mt-1.5 min-w-[5px] min-h-[5px] max-w-[5px] max-h-[5px] bg-[#388e3c]" />
                      <span><span className="font-[600]">Bank Offer</span> 10% off on Select Credit Cards, up to ₹1,500. On orders of ₹3,000 and above <span className="text-primary font-medium cursor-pointer">T&C</span></span>
                   </li>
                   <li className="flex gap-2">
                      <span className="text-[#388e3c] rounded-full mt-1.5 min-w-[5px] min-h-[5px] max-w-[5px] max-h-[5px] bg-[#388e3c]" />
                      <span><span className="font-[600]">Special Price</span> Get extra 15% off (price inclusive of cashback/coupon) <span className="text-primary font-medium cursor-pointer">T&C</span></span>
                   </li>
                </ul>
             </div>

             <div className="pt-2">
                <div className="flex text-[14px] mb-[24px]">
                  <span className="text-[#878787] w-[110px] font-[500]">Description</span>
                  <p className="flex-1 text-[#212121] whitespace-pre-wrap leading-relaxed max-w-[500px]">
                     {product.description || "Grab this amazing product now natively at unmatched values!"}
                  </p>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
