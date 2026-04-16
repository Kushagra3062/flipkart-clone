"use client";

import Navbar from "@/components/Navbar";
import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotificationsPage() {
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
                      <Link href="/notifications" className={`block px-12 py-3 text-[14px] font-bold ${pathname === '/notifications' ? 'bg-[#f5faff] text-[#2874f0]' : 'text-[#878787] hover:text-[#2874f0] hover:bg-[#f5faff]'} transition`}>
                          All Notifications
                      </Link>
                      <Link href="/notification-settings" className={`block px-12 py-3 text-[14px] font-[500] ${pathname === '/notification-settings' ? 'bg-[#f5faff] text-[#2874f0]' : 'text-[#212121] hover:text-[#2874f0] hover:bg-[#f5faff]'} transition`}>
                          Desktop Notifications
                      </Link>
                      <button className="w-full text-left px-12 py-3 text-[14px] font-[500] text-[#212121] hover:text-[#2874f0] hover:bg-[#f5faff] transition">
                          In-App Notifications
                      </button>
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
          <div className="flex-1 bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] rounded-sm min-h-[600px] flex items-center justify-center">
             <div className="text-center flex flex-col items-center">
                <img src="/banners/empty-notification.png" alt="No Notifications" className="w-[300px] mb-8" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('fallback-icon');
                }} />
                {/* Fallback SVG if image not found */}
                <div className="hidden fallback-icon:flex items-center justify-center bg-gray-50 rounded-full p-12 mb-8">
                  <Bell className="w-24 h-24 text-gray-300" />
                </div>
                
                <h2 className="text-[20px] font-bold text-[#212121] mb-2">All caught up!</h2>
                <p className="text-[14px] text-[#878787]">There are no new notifications for you.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
