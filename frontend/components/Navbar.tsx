"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, ChevronDown, User, MoreVertical, Store, HelpCircle, Bell, TrendingUp, Download, PieChart, Briefcase, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { items } = useCartStore();
  const { isLoggedIn, user, logout, token } = useAuthStore();
  const { fetchWishlist } = useWishlistStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoggedIn) {
      fetchWishlist();
    }
  }, [isLoggedIn, fetchWishlist]);

  const profileMenuItems = [
    { label: "My Profile", icon: <User className="w-4 h-4" />, link: "/profile" },
    { label: "Flipkart Plus Zone", icon: <Plus className="w-4 h-4 text-blue-600" />, link: "/plus" },
    { label: "Orders", icon: <Briefcase className="w-4 h-4" />, link: "/profile?section=orders" },
    { label: "Wishlist", icon: <TrendingUp className="w-4 h-4" />, link: "/wishlist" },
    { label: "Coupons", icon: <PieChart className="w-4 h-4" />, link: "/coupons" },
    { label: "Gift Cards", icon: <Download className="w-4 h-4" />, link: "/gift-cards" },
    { label: "Notifications", icon: <Bell className="w-4 h-4" />, link: "/notifications" },
    { label: "Logout", icon: <Download className="w-4 h-4 rotate-180" />, link: "#", action: logout },
  ];

  const moreMenuItems = [
    { label: "Notification Settings", icon: <Bell className="w-4 h-4" />, link: "/notification-settings" },
    { label: "24x7 Customer Care", icon: <HelpCircle className="w-4 h-4" />, link: "/helpcenter" },
    { label: "Advertise", icon: <TrendingUp className="w-4 h-4" />, link: "/advertise" },
    { label: "Download App", icon: <Download className="w-4 h-4" />, link: "/download-app" },
  ];

  const toggleProfileMenu = (show: boolean) => {
    if (show) setShowProfileMenu(true);
    else setTimeout(() => setShowProfileMenu(false), 300); // Add delay to keep menu open while moving mouse
  };

  return (
    <header className="sticky top-0 z-50 bg-[#ffe11b] py-2 shadow-sm">
      <div className="max-w-[1300px] mx-auto px-4 flex items-center gap-4 lg:gap-10 h-10 lg:h-12">
        
        {/* Left Section: Logo & Quick Links */}
        <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
          <Link href="/" className="flex flex-col group">
            <span className="text-[#2874f0] font-bold text-2xl italic tracking-tight mb-[-2px]">Flipkart</span>
            <div className="flex items-center gap-0.5 text-[#212121] text-[11px] italic font-medium">
              <span>Explore</span>
              <span className="text-primary-blue font-bold -ml-0.5">Plus</span>
              <Plus className="w-3 h-3 text-primary-blue fill-primary-blue -ml-0.5" />
            </div>
          </Link>
          
          <Link href="/minutes" className="hidden lg:flex items-center gap-2 bg-[#f0f2f5]/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/50 transition">
             <div className="bg-[#f0f2f5] p-1 rounded-md">
                <Store className="w-4 h-4 text-gray-600" />
             </div>
             <span className="text-sm font-medium text-gray-800">Minutes</span>
          </Link>

          <Link href="/travel" className="hidden lg:flex items-center gap-2 bg-[#f0f2f5]/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/50 transition">
             <div className="bg-[#f0f2f5] p-1 rounded-md text-red-400">
                <TrendingUp className="w-4 h-4" />
             </div>
             <span className="text-sm font-medium text-gray-800">Travel</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex max-w-2xl min-w-[300px]">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Search for Products, Brands and More" 
              className="w-full bg-[#f0f2f5] text-sm text-gray-800 px-10 py-2.5 rounded-lg border-none focus:outline-none focus:bg-white transition shadow-inner placeholder:text-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4 lg:gap-8 text-sm font-medium whitespace-nowrap">
          
          {/* Account Dropdown */}
          <div 
            className="relative" 
            onMouseEnter={() => setShowProfileMenu(true)} 
            onMouseLeave={() => toggleProfileMenu(false)}
          >
            <Link href={isLoggedIn ? "/profile" : "/login"} 
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition ${showProfileMenu ? 'bg-[#2874f0] text-white shadow-md' : 'hover:bg-white/30 text-gray-800'}`}
              onClick={(e) => {
                // Clicking the button should navigate even if the menu is open
                // NopreventDefault here unless we want to handle it manually
              }}
            >
              <User className="w-5 h-5" />
              <span>{isLoggedIn ? (user?.name?.split(' ')[0] || "User") : "Login"}</span>
              <ChevronDown className={`w-4 h-4 transition ${showProfileMenu ? 'rotate-180' : ''}`} />
            </Link>
            
            {mounted && showProfileMenu && (
              <div className="absolute top-full right-0 w-[240px] bg-white text-gray-800 shadow-2xl rounded-xl py-2 mt-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-50">
                {!isLoggedIn && (
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <span className="text-sm font-bold text-gray-900">New Customer?</span>
                    <Link href="/signup" className="text-[#2874f0] font-bold text-sm hover:underline">Sign Up</Link>
                  </div>
                )}
                {profileMenuItems.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => {
                        if (item.action) item.action();
                        router.push(item.link);
                        setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 font-medium"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-2 hover:bg-white/30 px-3 py-2.5 rounded-lg transition text-gray-800">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {mounted && items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#ffe11b] font-bold">
                  {items.length}
                </span>
              )}
            </div>
            <span className="hidden xl:block">Cart</span>
          </Link>

          {/* Become a Seller */}
          <Link href="/seller" className="hidden lg:flex items-center gap-2 hover:bg-white/30 px-3 py-2.5 rounded-lg transition text-gray-800">
            <Store className="w-5 h-5" />
            <span className="hidden xl:block">Become a Seller</span>
          </Link>

          {/* More Menu */}
          <div 
            className="relative hidden lg:block"
            onMouseEnter={() => setShowMoreMenu(true)}
            onMouseLeave={() => setShowMoreMenu(false)}
          >
            <button className={`p-2.5 rounded-lg transition ${showMoreMenu ? 'bg-white shadow' : 'hover:bg-white/30'}`}>
              <MoreVertical className="w-5 h-5 text-gray-800" />
            </button>
            {mounted && showMoreMenu && (
              <div className="absolute top-full right-0 w-[240px] bg-white text-gray-800 shadow-2xl rounded-xl py-2 mt-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 transition">
                {moreMenuItems.map((item, idx) => (
                  <Link href={item.link} key={idx} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-gray-700 font-medium">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
