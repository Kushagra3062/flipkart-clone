"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAddressStore } from "@/store/addressStore";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import AddressModal from "@/components/AddressModal";
import { MapPin, Check, ChevronRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total_amount, subtotal, total_discount, delivery_fee, clearCart } = useCartStore();
  const { addresses, fetchAddresses, selectedAddressId, setSelectedAddress } = useAddressStore();
  const { isLoggedIn, user, token } = useAuthStore();
  
  const [activeStep, setActiveStep] = useState(2); // Start at address if logged in
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ number: string, total: number } | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number, message: string} | null>(null);
  const [couponError, setCouponError] = useState("");

  const finalCartDiscount = total_discount + (appliedCoupon ? appliedCoupon.discount : 0);
  const finalCartTotal = total_amount - (appliedCoupon ? appliedCoupon.discount : 0);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/checkout");
      return;
    }
    fetchAddresses();
  }, [isLoggedIn, fetchAddresses, router]);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.is_default) || addresses[0];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setLoading(true);
    try {
      const payload = {
         use_existing_address_id: selectedAddress.id,
         payment_method: paymentMethod,
         coupon_code: appliedCoupon ? appliedCoupon.code : null
      };
      
      const res = await api.post("/api/v1/orders/checkout", payload);
      const finalTotal = res.data.total;
      clearCart();
      setSuccess({ number: res.data.order_number, total: finalTotal });
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || "Checkout failed! Please check your connection and try again.";
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f1f3f6]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 px-4">
           <div className="w-[80px] h-[80px] bg-[#388e3c] rounded-full flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105 duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
           </div>
           <h2 className="text-[26px] font-[500] text-[#212121] mb-2 mt-2 text-center tracking-tight">Order placed for ₹{success.total.toLocaleString()}!</h2>
           <p className="text-[15px] text-[#878787] mb-8 font-medium">Order ID: <span className="text-[#212121] font-bold">{success.number}</span></p>
           <div className="p-4 bg-white shadow-sm border border-gray-100 rounded-sm mb-6 flex flex-col items-center gap-2 max-w-sm w-full text-center">
               <span className="text-sm font-medium">Delivering to {selectedAddress?.full_name}</span>
               <span className="text-xs text-gray-500">{selectedAddress?.address_line1}, {selectedAddress?.city}</span>
           </div>
           <div className="flex gap-4">
             <button onClick={() => router.push("/")} className="bg-white text-gray-800 border border-gray-300 font-[500] px-8 py-[12px] rounded-[2px] shadow-sm tracking-wide transition uppercase text-[15px] hover:bg-gray-50">
               Continue Shopping
             </button>
             <button onClick={() => router.push("/profile?section=orders")} className="bg-primary hover:bg-blue-600 text-white font-[500] px-8 py-[12px] rounded-[2px] shadow-[0_1px_2px_0_rgba(0,0,0,.2)] tracking-wide transition uppercase text-[15px]">
               View Orders
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1240px] mx-auto p-2 sm:p-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          
          <div className="w-full lg:w-[68%] flex flex-col gap-4">
             {/* Step 1: Login */}
             <div className={`shadow-sm rounded-sm overflow-hidden ${activeStep === 1 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className={`px-6 py-[14px] flex justify-between items-center ${activeStep === 1 ? 'bg-primary text-white' : 'text-[#878787] bg-white'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 1 ? 'bg-white text-primary' : 'bg-[#f0f0f0] text-primary'}`}>1</div>
                      <span className="font-[500] text-[15px] uppercase">Login</span>
                   </div>
                   {activeStep > 1 && (
                     <button onClick={() => setActiveStep(1)} className="text-primary font-[500] text-[14px] bg-white px-6 py-1.5 border border-gray-200 shadow-sm rounded-sm">CHANGE</button>
                   )}
                </div>
                {activeStep === 1 && (
                  <div className="p-6 bg-white">
                     <p className="text-sm font-medium text-gray-800">{user?.name} <span className="text-gray-400 font-normal ml-2">{user?.phone || user?.email}</span></p>
                     <button onClick={() => setActiveStep(2)} className="mt-4 bg-[#fb641b] text-white px-10 py-3 text-sm font-bold rounded-sm shadow-md uppercase">Continue to Checkout</button>
                  </div>
                )}
             </div>

             {/* Step 2: Delivery Address */}
             <div className={`shadow-sm rounded-sm overflow-hidden ${activeStep === 2 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className={`px-6 py-[14px] flex justify-between items-center ${activeStep === 2 ? 'bg-primary text-white' : 'text-[#878787] bg-white border-t border-gray-100'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 2 ? 'bg-white text-primary' : 'bg-[#f0f0f0] text-primary'}`}>2</div>
                      <span className="font-[500] text-[15px] uppercase">Delivery Address</span>
                      {activeStep > 2 && selectedAddress && <span className="ml-4 text-[14px] text-gray-800 font-bold">{selectedAddress.full_name}</span>}
                   </div>
                   {activeStep > 2 && (
                     <button onClick={() => setActiveStep(2)} className="text-primary font-[500] text-[14px] bg-white px-6 py-1.5 border border-gray-200 shadow-sm rounded-sm">CHANGE</button>
                   )}
                </div>
                
                {activeStep === 2 && (
                   <div className="p-6 bg-white">
                     {selectedAddress ? (
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <span className="font-bold text-gray-800">{selectedAddress.full_name}</span>
                             <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded">{selectedAddress.address_type}</span>
                             <span className="ml-2 font-bold text-gray-800">{selectedAddress.phone}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                             {selectedAddress.address_line1}, {selectedAddress.address_line2 ? `${selectedAddress.address_line2}, ` : ''}
                             {selectedAddress.city}, {selectedAddress.state} - <span className="font-bold">{selectedAddress.pincode}</span>
                          </p>
                          <div className="pt-4 flex gap-4">
                             <button onClick={() => setActiveStep(3)} className="bg-accent text-white px-12 py-[14px] rounded-[2px] font-bold text-[16px] shadow-md uppercase tracking-wide hover:bg-[#eb5a13] transition">
                                Deliver Here
                             </button>
                             <button onClick={() => setShowAddressModal(true)} className="text-primary font-bold text-sm tracking-wide self-center hover:underline uppercase">
                                Change
                             </button>
                          </div>
                       </div>
                     ) : (
                       <div className="text-center py-4">
                          <p className="text-gray-500 mb-4">No addresses found.</p>
                          <button onClick={() => setShowAddressModal(true)} className="bg-primary text-white px-10 py-3 rounded-sm font-bold shadow-md uppercase">Add New Address</button>
                       </div>
                     )}
                   </div>
                )}
             </div>

             <AddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} />

             {/* Step 3: Order Summary */}
             <div className={`shadow-sm rounded-sm overflow-hidden ${activeStep === 3 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className={`px-6 py-[14px] flex items-center gap-4 ${activeStep === 3 ? 'bg-primary text-white' : 'text-[#878787] bg-white border-t border-gray-100'}`}>
                   <div className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 3 ? 'bg-white text-primary' : 'bg-[#f0f0f0] text-primary'}`}>3</div>
                   <span className="font-[500] text-[15px] uppercase">Order Summary</span>
                   {activeStep > 3 && <span className="ml-4 text-[14px] text-gray-800 font-bold">{items.length} Item{items.length > 1 && 's'}</span>}
                </div>
                {activeStep === 3 && (
                   <div className="p-6 bg-white space-y-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                           <div className="w-[80px] h-[80px] relative flex-shrink-0">
                              <img src={item.product.image_url} alt={item.product.name} className="object-contain w-full h-full" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                              <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                              <div className="mt-2 flex items-center gap-2">
                                 <span className="font-bold text-base">₹{item.product.price.toLocaleString()}</span>
                                 <span className="text-xs text-gray-400 line-through">₹{item.product.mrp.toLocaleString()}</span>
                                 <span className="text-xs text-green-600 font-bold">{item.product.discount_percent}% Off</span>
                              </div>
                           </div>
                        </div>
                      ))}

                      {/* Coupon Section */}
                      <div className="border-t border-gray-100 pt-4 mt-4">
                         <h4 className="text-sm font-bold text-gray-800 uppercase mb-3">Apply Coupon</h4>
                         {appliedCoupon ? (
                            <div className="bg-green-50 border border-green-200 p-3 rounded flex justify-between items-center">
                               <div>
                                  <span className="text-green-700 font-bold tracking-wide">{appliedCoupon.code} applied!</span>
                                  <p className="text-13px text-green-600 mt-0.5">{appliedCoupon.message}</p>
                               </div>
                               <button onClick={() => setAppliedCoupon(null)} className="text-sm text-red-500 font-bold hover:underline">REMOVE</button>
                            </div>
                         ) : (
                            <div className="flex flex-col gap-2">
                               <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Enter Coupon Code" 
                                    className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 uppercase outline-none focus:border-primary-blue transition-colors"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                  />
                                  <button onClick={async () => {
                                    if (!couponCode) return;
                                    try {
                                      setCouponError("");
                                      const res = await api.post(`/api/v1/coupons/validate?code=${couponCode}&cart_total=${subtotal}`);
                                      setAppliedCoupon({
                                        code: res.data.code,
                                        discount: res.data.discount_amount,
                                        message: res.data.message
                                      });
                                      setCouponCode("");
                                    } catch (err: any) {
                                      setCouponError(err.response?.data?.detail || "Invalid coupon code");
                                      setAppliedCoupon(null);
                                    }
                                  }} className="bg-gray-800 text-white px-6 py-2 rounded text-sm font-bold hover:bg-gray-700 transition uppercase tracking-wide">APPLY</button>
                               </div>
                               {couponError && <p className="text-red-500 text-xs font-medium">{couponError}</p>}
                            </div>
                         )}
                      </div>

                      <div className="flex justify-between items-center bg-[#f5faff] p-4 rounded-sm mt-4">
                         <span className="text-xs text-gray-600">Order confirmation email will be sent to <span className="font-bold text-gray-900">{user?.email}</span></span>
                         <button onClick={() => setActiveStep(4)} className="bg-[#fb641b] text-white px-12 py-[14px] rounded-[2px] font-bold text-[15px] shadow-md uppercase">Continue</button>
                      </div>
                   </div>
                )}
             </div>

             {/* Step 4: Payment Options */}
             <div className={`shadow-sm rounded-sm overflow-hidden ${activeStep === 4 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className={`px-6 py-[14px] flex items-center gap-4 ${activeStep === 4 ? 'bg-primary text-white' : 'text-[#878787] bg-white border-t border-gray-100'}`}>
                   <div className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 4 ? 'bg-white text-primary' : 'bg-[#f0f0f0] text-primary'}`}>4</div>
                   <span className="font-[500] text-[15px] uppercase">Payment Options</span>
                </div>
                {activeStep === 4 && (
                   <div className="p-6 bg-white space-y-6">
                      <div className="space-y-4">
                         {['UPI', 'Wallets', 'Credit / Debit / ATM Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                           <label key={method} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition ${paymentMethod === (method === 'Cash on Delivery' ? 'COD' : method) ? 'border-primary bg-blue-50/20' : 'border-gray-100 hover:border-gray-200'}`}>
                              <input type="radio" name="payment" checked={paymentMethod === (method === 'Cash on Delivery' ? 'COD' : method)} onChange={() => setPaymentMethod(method === 'Cash on Delivery' ? 'COD' : method)} className="w-4 h-4 accent-primary" />
                              <span className="text-[14px] font-medium text-gray-800">{method}</span>
                           </label>
                         ))}
                      </div>
                      <div className="border-t border-gray-100 pt-6 flex justify-end">
                         <button onClick={handlePlaceOrder} disabled={loading} className="bg-accent text-white px-16 py-[15px] rounded-[2px] font-bold text-[16px] shadow-lg uppercase tracking-wider hover:bg-[#e85a1a] transition disabled:bg-gray-400">
                           {loading ? "PLACING ORDER..." : "Place Order"}
                         </button>
                      </div>
                   </div>
                )}
             </div>
          </div>

          {/* Right Column: Price Details */}
          <div className="w-full lg:w-[32%] relative">
              <div className="bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] sticky top-[72px] rounded-sm">
                <div className="p-[14px] border-b border-gray-100 flex items-center min-h-[48px]">
                  <h3 className="text-[15px] font-[500] text-[#878787] tracking-wide uppercase px-1">Price Details</h3>
                </div>
                
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between text-[15px] text-[#212121]">
                    <span>Price ({items.length} item{items.length > 1 && 's'})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-[15px] text-[#212121]">
                    <span>Discount</span>
                    <span className="text-[#388e3c]">- ₹{finalCartDiscount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-[15px] text-[#212121]">
                    <span>Delivery Charges</span>
                    <span className="text-[#388e3c]">{delivery_fee === 0 ? "Free" : `₹${delivery_fee}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-[18px] font-bold text-[#212121] border-t border-dashed border-[#e0e0e0] py-[14px] mt-1">
                    <span>Total Amount</span>
                    <span>₹{finalCartTotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-[15px] font-[500] text-[#388e3c] pb-1">
                    You will save ₹{finalCartDiscount.toLocaleString()} on this order
                  </div>
                </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
