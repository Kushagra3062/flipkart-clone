import Navbar from "@/components/Navbar";
import { Users, CreditCard, TrendingDown, Headphones, ShoppingBag } from "lucide-react";

export default function SellerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-2">
         <div className="max-w-[1240px] mx-auto px-4 text-sm text-gray-600 flex justify-end">
            Existing Seller? Explore our product recommendations with Dhamaka Selection
         </div>
      </div>
      
      {/* Seller Navbar */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
         <div className="max-w-[1240px] mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="text-[#2874f0] font-bold text-xl italic flex items-center">
                  Flipkart <span className="not-italic text-sm text-gray-800 mt-1 ml-1 bg-yellow-400 px-1 py-0.5 rounded">Seller Hub</span>
               </div>
               <nav className="hidden md:flex gap-6 text-[15px] font-medium text-gray-700">
                  <span className="cursor-pointer hover:text-primary-blue">Sell Online</span>
                  <span className="cursor-pointer hover:text-primary-blue">Fees and Commission</span>
                  <span className="cursor-pointer hover:text-primary-blue">Grow</span>
                  <span className="cursor-pointer hover:text-primary-blue">Learn</span>
                  <span className="cursor-pointer hover:text-primary-blue">Shopsy</span>
               </nav>
            </div>
            <div className="flex items-center gap-6">
               <button className="text-[15px] font-medium hover:text-primary-blue">Login</button>
               <button className="bg-[#ffc200] text-gray-900 font-bold px-6 py-3 rounded text-[15px] hover:bg-yellow-400 transition">Start Selling</button>
            </div>
         </div>
      </div>

      <div className="max-w-[1240px] mx-auto py-4 px-4 text-xs text-gray-500 font-medium">
         Home &gt; Sell Online
      </div>

      <div className="max-w-[1240px] mx-auto bg-white rounded-t-3xl overflow-hidden relative border border-gray-100 shadow-sm mt-4">
         <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
         </div>
         <div className="relative z-10 px-12 py-24 w-1/2">
            <h1 className="text-5xl font-black text-gray-800 leading-tight mb-6">Sell Online with Flipkart</h1>
         </div>
         <div className="absolute right-0 bottom-0 top-0 w-1/2 z-10 flex items-end justify-center">
             <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600" className="w-[80%] h-[90%] object-cover object-top mix-blend-darken" />
         </div>
      </div>

      <div className="max-w-[1240px] mx-auto bg-white border-x border-b border-gray-100 shadow-sm rounded-b-3xl">
         <div className="flex divide-x divide-gray-100">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50 transition cursor-pointer">
               <Users className="w-10 h-10 text-primary-blue mb-4" />
               <p className="font-bold text-gray-700 text-sm">45 crore+ Flipkart customers</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50 transition cursor-pointer">
               <CreditCard className="w-10 h-10 text-primary-blue mb-4" />
               <p className="font-bold text-gray-700 text-sm">7* days secure & regular payments</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50 transition cursor-pointer">
               <TrendingDown className="w-10 h-10 text-primary-blue mb-4" />
               <p className="font-bold text-gray-700 text-sm">Low cost of doing business</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50 transition cursor-pointer">
               <Headphones className="w-10 h-10 text-primary-blue mb-4" />
               <p className="font-bold text-gray-700 text-sm">One click Seller Support</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50 transition cursor-pointer">
               <ShoppingBag className="w-10 h-10 text-primary-blue mb-4" />
               <p className="font-bold text-gray-700 text-sm">Access to The Big Billion Days & more</p>
            </div>
         </div>
      </div>
    </div>
  );
}
