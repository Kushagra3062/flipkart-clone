"use client";

import Navbar from "@/components/Navbar";
import { Ticket, Clock, Info, CheckCircle, ChevronRight, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Skeleton from "@/components/Skeleton";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/v1/coupons");
        setCoupons(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const availableCoupons = coupons.slice(0, 2);
  const upcomingCoupons = coupons.slice(2, 5);

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
        
        {/* Sidebar */}
        <div className="w-[280px] hidden lg:block space-y-4">
           <div className="bg-white shadow-sm p-5 flex items-center justify-between border-b border-gray-100">
              <span className="font-bold text-gray-900 flex items-center gap-2">
                 <Filter className="w-4 h-4" /> Filters
              </span>
              <button className="text-primary-blue text-xs font-bold uppercase">Clear All</button>
           </div>
           <div className="bg-white shadow-sm p-5 space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</p>
              {["All", "Electronics", "Fashion", "Mobiles", "Appliances"].map(c => (
                <div key={c} className="flex items-center gap-3">
                   <input type="checkbox" className="w-4 h-4 accent-primary-blue" />
                   <span className="text-sm text-gray-700 font-medium">{c}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-5 shadow-sm rounded-sm flex items-center justify-between">
             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Ticket className="w-6 h-6 text-red-500" />
                Available Coupons
             </h1>
             <span className="text-sm text-gray-500 font-medium">{availableCoupons.length} Coupons Found</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              [1, 2].map(i => <Skeleton key={i} variant="rect" width="100%" height={160} />)
            ) : availableCoupons.length > 0 ? (
              availableCoupons.map((c, i) => (
                <div key={i} className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex hover:border-primary-blue transition group">
                   <div className="w-4 bg-red-400 group-hover:bg-primary-blue transition" />
                   <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-red-100">Limited Offer</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                               <Clock className="w-3 h-3" /> Valid till {new Date(c.expiry_date).toLocaleDateString()}
                            </span>
                         </div>
                         <h3 className="text-lg font-black text-gray-900 tracking-tight">{c.description}</h3>
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Info className="w-4 h-4 text-gray-400" />
                            <span>Min. order of ₹{c.min_order_value}</span>
                         </div>
                         <button className="text-primary-blue text-xs font-bold uppercase hover:underline flex items-center">
                            View T&C <ChevronRight className="w-3 h-3" />
                         </button>
                      </div>
                      <div className="w-full md:w-auto flex flex-col items-center gap-2">
                         <div className="bg-dashed-border border-2 border-dashed border-gray-200 p-3 rounded-lg flex flex-col items-center min-w-[140px]">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Coupon Code</span>
                            <span className="text-lg font-black text-primary-gray uppercase">{c.code}</span>
                         </div>
                         <button className="text-xs font-bold text-primary-blue uppercase mt-1">Copy Code</button>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-20 flex flex-col items-center justify-center text-center space-y-4 shadow-sm border border-gray-100 rounded">
                 <div className="bg-gray-50 p-6 rounded-full">
                    <Ticket className="w-12 h-12 text-gray-300" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">No Coupons Available</h2>
                 <p className="text-gray-500 max-w-xs">Check back later for exciting offers and exclusive discounts.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded shadow-sm border border-gray-100 mt-10">
             <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Coupons</h2>
             <div className="space-y-6">
                {upcomingCoupons.length > 0 ? upcomingCoupons.map((uc, i) => (
                  <div key={i} className="flex gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                     <div className="w-[100px] h-[60px] bg-gray-50 rounded flex items-center justify-center border border-gray-100 overflow-hidden relative group cursor-pointer hover:border-primary-blue transition">
                        <div className="absolute inset-0 bg-primary-blue/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10">
                           <span className="text-[10px] font-bold text-primary-blue uppercase tracking-widest hidden group-hover:block">Locked</span>
                        </div>
                        <Ticket className="w-6 h-6 text-gray-300 group-hover:text-primary-blue/50 transition" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-gray-800 line-clamp-1">{uc.description}</h4>
                        <p className="text-xs text-gray-500">Unlocks soon | Code hidden</p>
                        <button className="text-gray-400 text-xs font-bold uppercase mt-2 hover:text-gray-600 transition">View T&C</button>
                     </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-sm italic">More coupons incoming soon...</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
