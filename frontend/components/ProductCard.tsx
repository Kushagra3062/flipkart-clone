"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount_percent: number;
  rating: number;
  rating_count: number;
  image_url?: string;
  images?: { image_url: string; is_primary: boolean }[];
  is_assured?: boolean;
}

export default function ProductCard({ item }: { item: Product }) {
  const { isLoggedIn, token } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(item.id);
  const primaryImage = item.image_url || (item.images && item.images.length > 0 ? item.images[0].image_url : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400');

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) return;
    await toggleWishlist(item.id);
  };

  return (
    <Link href={`/product/${item.id}`}>
      <motion.div 
        whileHover={{ scale: 1.01 }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-md p-3 flex flex-col h-full group transition-all duration-300 relative border border-gray-100/50 hover:shadow-[0_4px_16px_0_rgba(0,0,0,.1)] min-h-[300px]"
      >
        <div className="relative w-full h-[180px] mb-3 flex items-center justify-center overflow-hidden">
          <Image 
            src={primaryImage} 
            alt={item.name}
            fill
            className="object-contain transition duration-500 scale-95 group-hover:scale-100"
            sizes="(max-width: 768px) 100vw, 200px"
          />
          {isLoggedIn && (
            <button 
              onClick={handleToggleWishlist}
              className="absolute top-0 right-0 p-1.5 bg-white shadow-sm border border-gray-100 rounded-full z-10 transition hover:scale-110 active:scale-90"
            >
              <Heart className={`w-4 h-4 transition ${isWishlisted ? 'fill-[#ff4343] text-[#ff4343]' : 'text-gray-300'}`} />
            </button>
          )}
        </div>
        
        <div className="flex flex-col gap-1 mt-auto">
          <h3 className="text-[13px] lg:text-[14px] text-[#212121] leading-tight line-clamp-2 min-h-[36px] font-medium group-hover:text-primary-blue transition">
            {item.name}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-[1px] rounded-[3px] flex items-center gap-0.5">
              {Number(item.rating || 4.2).toFixed(1)} <Star className="w-[10px] h-[10px] fill-current" />
            </div>
            <span className="text-[#878787] text-[12px] font-medium">({Number(item.rating_count || 1234).toLocaleString()})</span>
            {item.is_assured !== false && (
               <Image 
                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                alt="Assured" 
                width={65} 
                height={18} 
                className="ml-1"
               />
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[16px] font-bold text-[#212121]">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
            <span className="text-[13px] text-[#878787] line-through">₹{Number(item.mrp || 0).toLocaleString('en-IN')}</span>
            <span className="text-[13px] font-bold text-[#388e3c]">{Math.round(item.discount_percent || 0)}% off</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
