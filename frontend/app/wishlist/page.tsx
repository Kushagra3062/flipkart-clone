"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import Navbar from "@/components/Navbar";
import { Trash2, ShoppingCart, Heart, Star, ChevronRight } from "lucide-react";
import Skeleton from "@/components/Skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount_percent: number;
  image_url: string;
  rating: number;
  rating_count: number;
  brand: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { items: wishlistSummary, toggleWishlist } = useWishlistStore();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlistDetails = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/profile/wishlist");
      setItems(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/wishlist");
      return;
    }
    loadWishlistDetails();
  }, [isLoggedIn, wishlistSummary.length, loadWishlistDetails]); // Re-load when summary length changes

  const removeItem = async (id: string) => {
    await toggleWishlist(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 flex gap-4">
           <div className="w-[280px] hidden lg:block bg-white shadow-sm p-4 space-y-4">
              <Skeleton variant="circle" width={40} height={40} />
              <Skeleton variant="text" width="60%" />
           </div>
           <div className="flex-1 bg-white shadow-sm p-6 space-y-8">
              <Skeleton variant="text" width="30%" height={32} />
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-6 pb-6 border-b border-gray-100">
                  <Skeleton variant="rect" width={120} height={120} />
                  <div className="flex-1 space-y-4">
                     <Skeleton variant="text" width="70%" />
                     <Skeleton variant="text" width="20%" />
                     <Skeleton variant="text" width="40%" />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-4">
        
        {/* Sidebar Mini */}
        <div className="w-[280px] hidden lg:block">
          <div className="bg-white shadow-sm">
            <div className="p-4 border-b border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2 rounded-full">
                    <Heart className="w-5 h-5 text-[#ff4343] fill-[#ff4343]" />
                  </div>
                  <span className="font-bold text-gray-800">My Wishlist ({items.length})</span>
               </div>
            </div>
            <div className="py-2">
               <Link href="/profile" className="flex items-center justify-between px-5 py-3 hover:bg-blue-50 group">
                  <span className="text-[13px] font-bold text-gray-700 uppercase">Profile Settings</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
               </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-sm min-h-[600px]">
          <div className="p-5 border-b border-gray-100">
            <h1 className="text-[18px] font-bold text-gray-900">My Wishlist ({items.length})</h1>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition relative group">
                <div className="w-[120px] h-[120px] flex-shrink-0 relative bg-white flex items-center justify-center">
                  {item.image_url ? (
                    <Image 
                      src={item.image_url} 
                      alt={item.name} 
                      fill 
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-gray-200" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.id}`} className="block group-hover:text-primary transition">
                    <h2 className="text-[16px] text-gray-800 font-medium truncate mb-1">{item.name}</h2>
                  </Link>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-green-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                      {item.rating} <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <span className="text-gray-400 text-xs font-semibold">({item.rating_count})</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[20px] font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">₹{item.mrp.toLocaleString()}</span>
                    <span className="text-xs font-bold text-green-600">{item.discount_percent}% off</span>
                  </div>
                </div>

                <div className="sm:absolute sm:right-6 sm:top-6 flex items-center gap-4">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                   <Heart className="w-16 h-16 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Empty Wishlist</h3>
                <p className="text-gray-500 text-sm max-w-xs mb-8">
                  You have no items in your wishlist. Start adding things you love!
                </p>
                <Link href="/" className="bg-primary text-white px-10 py-3 rounded-sm font-bold text-sm hover:shadow-lg transition">
                  CONTINUE SHOPPING
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
