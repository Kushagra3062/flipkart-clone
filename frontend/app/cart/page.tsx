"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAddressStore } from "@/store/addressStore";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import AddressModal from "@/components/AddressModal";
import Skeleton from "@/components/Skeleton";
import { Star, ShieldAlert, ChevronDown, MapPin } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"flipkart" | "minutes">("flipkart");
  const { items, subtotal, total_discount, delivery_fee, total_amount, fetchCart, updateQuantity, removeFromCart, isLoading } = useCartStore();
  const { addresses, fetchAddresses, selectedAddressId } = useAddressStore();
  const { isLoggedIn } = useAuthStore();
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/cart");
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [isLoggedIn, fetchCart, fetchAddresses, router]);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.is_default) || addresses[0];

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1300px] mx-auto p-2 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Left Column */}
          <div className="w-full lg:w-[68%]">
            
            {/* Tabs */}
            <div className="bg-white shadow-sm flex border-b border-gray-100">
              <button 
                onClick={() => setActiveTab("flipkart")}
                className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === "flipkart" ? 'text-primary-blue' : 'text-gray-500'}`}
              >
                Flipkart ({items.length})
                {activeTab === "flipkart" && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-blue" />}
              </button>
              <button 
                onClick={() => setActiveTab("minutes")}
                className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === "minutes" ? 'text-primary-blue' : 'text-gray-500'}`}
              >
                Minutes ({0})
                {activeTab === "minutes" && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-blue" />}
              </button>
            </div>

            {/* Delivery Address Section */}
            <div className="bg-white shadow-sm mt-3 p-4 flex items-center justify-between border-b border-gray-100">
               <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex flex-col">
                     {selectedAddress ? (
                       <>
                         <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-[#212121]">Deliver to: <span className="text-[#212121]">{selectedAddress.full_name}, {selectedAddress.pincode}</span></span>
                            <span className="bg-[#f0f2f5] px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase">{selectedAddress.address_type}</span>
                         </div>
                         <span className="text-[12px] text-gray-500 line-clamp-1 mt-0.5 max-w-[400px]">
                           {selectedAddress.address_line1}, {selectedAddress.address_line2 ? `${selectedAddress.address_line2}, ` : ''}{selectedAddress.city}
                         </span>
                       </>
                     ) : (
                       <span className="text-[14px] font-bold text-gray-400 italic">No delivery address selected</span>
                     )}
                  </div>
               </div>
               <button 
                onClick={() => setShowAddressModal(true)}
                className="border border-gray-200 text-primary-blue px-4 py-2 rounded text-[14px] font-bold hover:bg-gray-50 transition shadow-sm"
               >
                  {selectedAddress ? "Change" : "Add Address"}
               </button>
            </div>

            <AddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} />
            
            <div className="bg-white shadow-sm mt-3 rounded-sm">
              {isLoading && items.length === 0 ? (
                <div className="flex flex-col">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 border-b border-gray-100 flex gap-6">
                      <Skeleton variant="rect" width={140} height={140} />
                      <div className="flex-1 space-y-4">
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="rect" width="100px" height={24} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center h-[400px] bg-white">
                  <Image src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" width={200} height={200} alt="Empty Cart" />
                  <h3 className="text-[18px] text-[#212121] mt-5 mb-2 font-bold">Missing Cart items?</h3>
                  <span className="text-[14px] text-[#212121] mb-6">Login to see the items you added previously</span>
                  <Link href="/login" className="bg-[#fb641b] text-white font-bold px-12 py-[12px] rounded-sm shadow-md hover:bg-[#e85a1a] transition">
                    Login
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((cartItem) => (
                    <div key={cartItem.id} className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-6 lg:gap-8 relative group">
                      {/* Image & Quantity */}
                      <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-[110px] h-[110px] lg:w-[140px] lg:h-[140px]">
                          <Image src={cartItem.product.image_url || "/placeholder.png"} alt={cartItem.product.name} fill className="object-contain" />
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            disabled={cartItem.quantity <= 1}
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-[20px] bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                          >-</button>
                          <div className="w-10 h-7 border border-gray-300 flex items-center justify-center text-[14px] font-bold bg-white rounded-sm">
                            {cartItem.quantity}
                          </div>
                          <button 
                            disabled={cartItem.quantity >= 10}
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-[20px] bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                          >+</button>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex flex-col flex-1 gap-1">
                        <Link href={`/product/${cartItem.product.id}`} className="text-[15px] lg:text-[16px] text-[#212121] hover:text-primary-blue transition font-medium line-clamp-1">
                          {cartItem.product.name}
                        </Link>
                        <div className="text-[13px] text-gray-500 mb-1">
                           Size: M
                        </div>
                        <div className="flex items-center gap-1.5 ">
                           <div className="bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-[1px] rounded-[3px] flex items-center gap-0.5">
                              {Number(cartItem.product.rating || 4.2).toFixed(1)} <Star className="w-[10px] h-[10px] fill-current" />
                           </div>
                           <span className="text-[#878787] text-[12px] font-medium">({Number(cartItem.product.rating_count || 1234).toLocaleString()})</span>
                           <Image 
                              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                              alt="Assured" 
                              width={60} 
                              height={16} 
                              className="ml-1"
                           />
                        </div>

                        <div className="flex items-center gap-2.5 mt-2">
                           <span className="text-[#878787] text-[14px] line-through">₹{(cartItem.product.mrp * cartItem.quantity).toLocaleString('en-IN')}</span>
                           <span className="text-[18px] lg:text-[20px] font-bold text-[#212121]">₹{(cartItem.product.price * cartItem.quantity).toLocaleString('en-IN')}</span>
                           <span className="text-[13px] font-bold text-[#388e3c] ml-1">{Math.round(cartItem.product.discount_percent || 0)}% Off</span>
                        </div>
                        
                        <div className="flex flex-col gap-1 mt-1">
                           <div className="flex items-center gap-2">
                              <span className="text-[13px] text-primary-blue font-bold uppercase italic tracking-tighter shadow-sm w-fit">WOW!</span>
                              <span className="text-[13px] text-[#212121] font-medium">Buy at ₹{Math.round(cartItem.product.price * 0.9).toLocaleString('en-IN')}</span>
                           </div>
                           <span className="text-[12px] text-gray-500 mt-0.5">Delivery by Apr 20, Mon | <span className="text-[#388e3c] font-medium">Free</span></span>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap gap-6 items-center border-t border-gray-50 pt-4">
                          <button className="text-[14px] lg:text-[16px] font-bold text-[#212121] hover:text-primary-blue uppercase transition flex items-center gap-2">
                             <span className="w-5 h-5 border border-gray-300 rounded-sm flex items-center justify-center text-[10px]">+</span>
                             Save for later
                          </button>
                          <button 
                            onClick={() => removeFromCart(cartItem.id)}
                            className="text-[14px] lg:text-[16px] font-bold text-[#212121] hover:text-primary-blue uppercase transition flex items-center gap-2 underline"
                          >
                             Remove
                          </button>
                          <button className="text-[14px] lg:text-[16px] font-bold text-[#212121] hover:text-primary-blue uppercase transition flex items-center gap-2">
                             <span className="text-[#2874f0] tracking-tighter opacity-70">⚡</span>
                             Buy this now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Sticky Checkout Header (bottom of cart list as per screenshot) */}
                  <div className="p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] sticky bottom-0 bg-white flex justify-end z-10">
                    <button 
                      onClick={() => router.push("/checkout")}
                      className="bg-[#fb641b] text-white px-10 lg:px-20 py-[14px] rounded-sm font-bold text-[16px] shadow-md hover:bg-[#eb5a13] transition w-full md:w-auto uppercase tracking-wide"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column: Price Details */}
          {items.length > 0 && (activeTab === "flipkart") && (
            <div className="w-full lg:w-[32%] flex flex-col gap-4">
              <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                <div className="p-[14px] border-b border-gray-100">
                  <h3 className="text-[16px] font-bold text-gray-400 tracking-wide uppercase">Price Details</h3>
                </div>
                
                <div className="p-5 flex flex-col gap-5 border-b border-dashed border-gray-200">
                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Price ({items.length} item{items.length > 1 && 's'})</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Discounts</span>
                    <span className="text-[#388e3c]">- ₹{total_discount.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Delivery Charges</span>
                    <span className="text-[#388e3c]">{delivery_fee === 0 ? "Free" : `₹${delivery_fee}`}</span>
                  </div>
                </div>

                <div className="px-5 py-6">
                   <div className="flex justify-between text-[20px] font-bold text-[#212121] mb-4">
                      <span>Total Amount</span>
                      <span>₹{total_amount.toLocaleString('en-IN')}</span>
                   </div>
                   
                   <div className="bg-[#e7f6e8] text-[#388e3c] p-2 rounded-sm text-[14px] font-bold flex items-center gap-2">
                       <span className="w-4 h-4 rounded-full border border-green-600 flex items-center justify-center text-[10px]">%</span>
                       You'll save ₹{total_discount.toLocaleString('en-IN')} on this order!
                   </div>
                </div>
              </div>

              {/* Secure Checkout Badge */}
              <div className="flex items-center gap-4 text-gray-500 p-4 border rounded-lg border-gray-100 bg-white/30">
                 <ShieldAlert className="w-10 h-10 opacity-40 shrink-0" />
                 <span className="text-[13px] font-medium leading-tight">Safe and secure payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
