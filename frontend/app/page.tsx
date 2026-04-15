"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import CategoryBar from "@/components/CategoryBar";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard, { Product } from "@/components/ProductCard";
import Skeleton from "@/components/Skeleton";
import { api } from "@/lib/api";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const userName = user?.name?.split(' ')[0] || "User";

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function feed() {
      try {
        const res = await api.get("/api/v1/products?limit=20");
        setProducts(res.data.items);
      } catch (err) {
        console.error("Failed executing items block:", err);
      } finally {
        setLoading(false);
      }
    }
    feed();
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <CategoryBar />
      
      <main className="max-w-[1300px] mx-auto px-1 md:px-2 pb-12 pt-2">
        <HeroCarousel />
        
        {/* Recommendation Section */}
        <div className="mt-4 bg-[#f1f3f6] relative group">
           <div className="bg-white rounded-none md:rounded-lg overflow-hidden shadow-sm relative">
              <div className="flex border-b border-gray-100 p-4 md:p-6 justify-between items-center bg-white">
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#212121]">
                  {userName}, still looking for these?
                </h2>
                <div 
                  onClick={() => scroll("right")}
                  className="bg-[#2874f0] text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition z-10"
                >
                  <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
              
              <div className="relative">
                {/* Left Button */}
                <button 
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 p-4 shadow-lg rounded-r-md z-10 hover:bg-white transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>

                <div className="p-2 md:p-4 bg-white">
                  {loading ? (
                    <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="min-w-[160px] md:min-w-[210px] flex-shrink-0 space-y-2 border border-gray-100 p-2">
                          <Skeleton variant="rect" width="100%" height={150} />
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="40%" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      ref={scrollRef}
                      className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4 scroll-smooth"
                    >
                      {products.map(item => (
                        <div key={item.id} className="min-w-[160px] md:min-w-[210px] h-full flex-shrink-0">
                          <ProductCard item={item} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Button */}
                <button 
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 p-4 shadow-lg rounded-l-md z-10 hover:bg-white transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </div>
           </div>
        </div>

        {/* Featured Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Real Flipkart Banners */}
           <div className="md:col-span-2 h-[150px] lg:h-[220px] bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
              <img src="/banners/electronics.png" alt="Big Electronics Sale" className="w-full h-full object-cover" />
           </div>
           <div className="h-[150px] lg:h-[220px] bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
              <img src="/banners/fashion.png" alt="Summer Fashion Trends" className="w-full h-full object-cover" />
           </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="h-[150px] lg:h-[220px] bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
              <img src="/banners/appliances.png" alt="Home Essentials Sale" className="w-full h-full object-cover" />
           </div>
           <div className="md:col-span-2 h-[150px] lg:h-[220px] bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
              <img src="/banners/mobiles.png" alt="Latest Mobile Offers" className="w-full h-full object-cover" />
           </div>
        </div>

      </main>
    </div>
  );
}
