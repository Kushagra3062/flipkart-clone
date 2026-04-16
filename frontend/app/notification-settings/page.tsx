"use client";

import Navbar from "@/components/Navbar";
import { Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotificationSettingsPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1240px] mx-auto py-6 px-4">
        <div className="flex gap-4">
          
          {/* Notifications Layout Sidebar */}
          <div className="w-[280px] flex-shrink-0">
             <div className="bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] rounded-sm">
                <div className="py-2">
                   <div className="flex items-center gap-4 px-4 py-3 bg-white">
                      <Bell className="w-5 h-5 text-[#2874f0]" />
                      <span className="font-bold text-[14px] text-gray-500 uppercase tracking-wider">Notification Preferences</span>
                   </div>
                   <div className="space-y-1 py-2">
                      <Link href="/notifications" className={`block px-12 py-3 text-[14px] font-[500] ${pathname === '/notifications' ? 'bg-[#f5faff] text-[#2874f0]' : 'text-[#212121] hover:text-[#2874f0] hover:bg-[#f5faff]'} transition`}>
                          Desktop Notifications
                      </Link>
                      <Link href="/notification-settings" className={`block px-12 py-3 text-[14px] font-bold ${pathname === '/notification-settings' ? 'bg-[#f5faff] text-[#2874f0]' : 'text-[#878787] hover:text-[#2874f0] hover:bg-[#f5faff]'} transition`}>
                          In-App Notifications
                      </Link>
                      <button className="w-full text-left px-12 py-3 text-[14px] font-[500] text-[#212121] hover:text-[#2874f0] hover:bg-[#f5faff] transition">
                          SMS
                      </button>
                      <button className="w-full text-left px-12 py-3 text-[14px] font-[500] text-[#212121] hover:text-[#2874f0] hover:bg-[#f5faff] transition">
                          Email
                      </button>
                      <button className="w-full text-left px-12 py-3 text-[14px] font-[500] text-[#212121] hover:text-[#2874f0] hover:bg-[#f5faff] transition">
                          WhatsApp
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Pane */}
          <div className="flex-1 bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] rounded-sm min-h-[600px] p-8">
             <div className="flex items-start justify-between">
                 <div className="w-3/5">
                    <h2 className="text-[18px] font-bold text-[#212121] mb-6">Desktop Notifications</h2>
                    
                    <div className="space-y-6">
                        {[
                          { title: "My Orders", desc: "Latest updates on your orders", checked: true },
                          { title: "Reminders", desc: "Price Drops, Back-in-stock Products, etc.", checked: true },
                          { title: "Recommendations by Flipkart", desc: "Products, offers and curated content based on your interest", checked: true },
                          { title: "New Offers", desc: "Top Deals and more", checked: true },
                          { title: "My Flipkart Community", desc: "Profile updates, Newsletters, etc.", checked: true },
                          { title: "Feedback and Review", desc: "Rating and Reviews for your purchase", checked: true }
                        ].map((item, i) => (
                           <div key={i} className="flex justify-between items-start pb-6 border-b border-gray-100 last:border-0">
                               <div className="flex gap-4 items-start">
                                   <input type="checkbox" checked={item.checked} readOnly className="mt-1 w-4 h-4 accent-[#2874f0]" />
                                   <div>
                                       <h4 className="text-[15px] font-[500] text-[#878787]">{item.title}</h4>
                                       <p className="text-[13px] text-[#878787] mt-1">{item.desc}</p>
                                   </div>
                               </div>
                               <ChevronDown className="w-5 h-5 text-gray-300" />
                           </div>
                        ))}
                    </div>
                 </div>

                 <div className="w-1/3 flex flex-col items-center pt-10">
                    <div className="relative mb-6">
                       <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg relative z-10">
                          <Bell className="w-10 h-10 text-white" />
                       </div>
                       {/* Distraught icons scattered */}
                       <div className="absolute -top-10 -left-10 w-16 h-16 bg-gray-100 rounded flex items-center justify-center opacity-70"><Bell className="w-6 h-6 text-gray-400" /></div>
                       <div className="absolute top-10 -right-16 w-12 h-16 bg-gray-100 rounded flex items-center justify-center opacity-70"><div className="w-6 h-10 bg-gray-300 rounded-sm"></div></div>
                    </div>
                    <p className="text-[#ff6161] text-[13px] text-center font-[500] mb-4">
                       Oops! You are missing out on a lot of important notifications. Please switch it on from Browser Settings.
                    </p>
                    <div className="text-center">
                       <p className="text-[12px] text-gray-500 mb-1">How to Unblock</p>
                       <p className="text-[14px] font-bold text-gray-800 flex items-center justify-center gap-1">
                          <span className="text-green-600">🔓</span> &gt; Notifications &gt; Allow
                       </p>
                    </div>
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
