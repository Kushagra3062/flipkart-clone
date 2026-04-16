"use client";

import Navbar from "@/components/Navbar";
import { CreditCard, ShieldCheck, Gift, ChevronRight, HelpCircle, Share2, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function GiftCardsPage() {
  const { isLoggedIn } = useAuthStore();
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/api/v1/giftcards/apply", null, {
         params: { card_number: cardNumber, pin }
      });
      setMsg(`Success! Added ₹${res.data.balance} to your account.`);
      setCardNumber("");
      setPin("");
      loadCards();
    } catch (err: any) {
      setMsg(err.response?.data?.detail || "Failed to link gift card. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  const loadCards = async () => {
    if (isLoggedIn) {
      const res = await api.get("/api/v1/giftcards/me");
      setGiftCards(res.data);
    }
  };

  useEffect(() => {
    loadCards();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      
      {/* Hero Banner Area */}
      <div className="max-w-[1240px] mx-auto px-4 py-6">
        <div className="relative w-full aspect-[21/9] lg:aspect-[3/1] rounded-xl overflow-hidden shadow-sm">
           {/* Fallback pattern while image renders */}
           <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                 <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter drop-shadow-lg">
                    Flipkart Gift Cards
                 </h1>
                 <p className="text-lg lg:text-xl font-medium text-white/90 drop-shadow">
                    The Perfect Gift for Every Occasion
                 </p>
              </div>
           </div>
           {/* Using placeholder until real asset is ready */}
           <Image 
             src="/banners/gift_card_hero.png" // This will be linked to the generated image
             alt="Flipkart Gift Cards Hero" 
             fill 
             className="object-cover opacity-0 transition-opacity duration-1000"
             onLoadingComplete={(img) => img.classList.remove('opacity-0')}
             priority
           />
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Actions & Form */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Add Gift Card</h2>
              {msg && <p className={`text-sm font-bold ${msg.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
              <form onSubmit={handleApply} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="16 Digit Card Number"
                      className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-primary-blue text-lg tracking-widest placeholder:tracking-normal placeholder:text-sm"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">6 Digit PIN</label>
                    <input 
                      type="password" 
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter 6 Digit PIN"
                      className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-primary-blue text-lg tracking-[8px] placeholder:tracking-normal placeholder:text-sm"
                      required
                      maxLength={6}
                    />
                 </div>
                 <button 
                   disabled={loading}
                   className="w-full bg-[#ff9f00] hover:bg-[#e89000] text-white font-bold py-4 rounded-lg transition shadow-md disabled:bg-gray-300 uppercase tracking-widest"
                 >
                   {loading ? "Adding..." : "Add to Account"}
                 </button>
              </form>
           </div>

           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Gift Cards</h2>
              {giftCards.length > 0 ? (
                <div className="space-y-4">
                   {giftCards.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-md shadow-sm">
                               <Gift className="w-5 h-5 text-pink-500" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-gray-400">.... {c.card_number.slice(-4)}</p>
                               <p className="font-bold text-gray-800">₹{c.balance.toLocaleString()}</p>
                            </div>
                         </div>
                         <span className="text-[10px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded border border-green-100">Active</span>
                      </div>
                   ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                   <div className="bg-gray-50 p-4 rounded-full w-fit mx-auto">
                      <CreditCard className="w-8 h-8 text-gray-300" />
                   </div>
                   <p className="text-sm text-gray-500 font-medium">No gift cards linked yet.</p>
                </div>
              )}
           </div>
        </div>

        {/* Right Column: Brands & Info */}
        <div className="lg:col-span-8 space-y-12">
           <section>
              <h2 className="text-2xl font-black text-gray-900 mb-8">Top Brands Gift Vouchers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { name: "Google Play", color: "bg-gray-900", img: "/gift_google.png", offer: "Up to 5% Off*" },
                   { name: "Tanishq", color: "bg-[#4a148c]", img: "/gift_tanishq.png", offer: "Up to 8% Off*" },
                   { name: "Kalyan", color: "bg-[#004d40]", img: "/gift_kalyan.png", offer: "Up to 4% Off*" },
                   { name: "More", color: "bg-gray-50", img: null, offer: "" }
                 ].map((brand, i) => (
                   <div key={i} className="flex flex-col items-center gap-3 group">
                      <div className={`w-full aspect-square rounded-2xl ${brand.color} shadow-lg border border-white/10 relative overflow-hidden flex items-center justify-center transition hover:scale-105 active:scale-95 cursor-pointer`}>
                         {brand.img ? (
                            <Image src={brand.img} alt={brand.name} fill className="object-cover" />
                         ) : (
                            <div className="flex flex-col items-center gap-1 font-black text-gray-400">
                               <Plus className="w-10 h-10" />
                               <span>MORE</span>
                            </div>
                         )}
                         {brand.offer && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                               <p className="text-white text-xs font-bold text-center leading-tight">
                                  {brand.name} {"\n"}
                                  <span className="text-yellow-400">{brand.offer}</span>
                                </p>
                            </div>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           <div className="bg-[#f2f7ff] p-8 rounded-xl border border-blue-100 flex items-center justify-between gap-6 cursor-pointer hover:bg-blue-50 transition">
              <div className="flex items-center gap-4">
                 <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-50">
                    <Share2 className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 italic tracking-tight">Share Now</h3>
                    <p className="text-sm text-gray-600">Gift your loved ones the freedom of choice.</p>
                 </div>
              </div>
              <ChevronRight className="w-6 h-6 text-blue-600" />
           </div>

           <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-4 text-gray-900 border-b pb-4 mb-4 cursor-pointer hover:bg-gray-50 p-2 transition rounded">
                 <HelpCircle className="w-6 h-6" />
                 <span className="flex-1 font-bold">Flipkart Gift Card Refund Incentive Program FAQs</span>
                 <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center gap-4 text-gray-900 cursor-pointer hover:bg-gray-50 p-2 transition rounded text-sm text-gray-500 font-medium">
                 <span>Gift cards are valid for 1 year from the date of issue. Terms and conditions apply.</span>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
