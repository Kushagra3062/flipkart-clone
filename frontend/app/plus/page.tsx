"use client";

import Navbar from "@/components/Navbar";
import { Plus, ChevronRight, Star, Zap, ShoppingBag, ShieldCheck, Headphones } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function PlusZonePage() {
  const { user, isLoggedIn } = useAuthStore();
  const [plusStatus, setPlusStatus] = useState<any>(null);

  useEffect(() => {
    if (isLoggedIn) {
      api.get("/api/v1/plus/status").then(res => setPlusStatus(res.data));
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#2874f0] py-8 text-white">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
               <span className="text-2xl font-bold italic italic tracking-tight">Flipkart</span>
               <div className="flex items-center gap-0.5 text-white text-[14px] italic font-medium bg-white/10 px-2 py-0.5 rounded">
                 <span>Explore</span>
                 <span className="text-primary-blue font-bold ml-1">Plus</span>
                 <Plus className="w-4 h-4 text-primary-blue fill-primary-blue" />
               </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              A World of Benefits {"\n"}Just for You
            </h1>
            <p className="text-lg text-white/90 font-medium">
              Join the elite league and enjoy free delivery, early access, and more.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 min-w-[300px]">
            <div className="flex items-center gap-3 mb-6">
               <div className="bg-yellow-400 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-white fill-current" />
               </div>
               <div>
                  <p className="text-sm font-medium text-white/70">SuperCoin Balance</p>
                  <p className="text-3xl font-bold">{plusStatus?.supercoins || 0}</p>
               </div>
            </div>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition shadow-lg">
               View Rewards
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 py-8 space-y-12">
        
        {/* Benefits Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            Plus Membership Benefits
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap />, title: "Free & Fast Delivery", desc: "Free shipping on over 5 lakh products." },
              { icon: <ShoppingBag />, title: "Early Access", desc: "Get ahead of others during major sales." },
              { icon: <Star />, title: "SuperCoin Rewards", desc: "Earn 2X SuperCoins on every order." },
              { icon: <Headphones />, title: "Priority Support", desc: "Special 24x7 customer care for Plus members." }
            ].map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 transition hover:shadow-md">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                   {b.icon}
                </div>
                <h3 className="font-bold text-gray-900">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Informative Content from Screenshot */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 prose prose-blue max-w-none">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Get Flipkart Plus Membership Online and Enjoy Benefits for the Plus Life</h2>
          <p className="text-[#878787] text-[14px] leading-relaxed mb-6">
            To democratise access and broaden diversity in e-commerce, Flipkart never stops adding new features. With this goal in mind, the reward programme Flipkart Plus is designed to improve client relationships and provide them with additional benefits...
          </p>
          
          <h2 className="text-xl font-bold text-gray-800 mb-6">All You Need to Know About Flipkart Plus Membership</h2>
          <p className="text-[#878787] text-[14px] leading-relaxed mb-6">
            Flipkart customers receive extra benefits in the form of SuperCoins. Every month, Flipkart issues billions of SuperCoins for its regular customers...
          </p>
        </section>

      </div>
    </div>
  );
}
