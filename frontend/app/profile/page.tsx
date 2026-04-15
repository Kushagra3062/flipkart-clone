"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useAddressStore } from "@/store/addressStore";
import Navbar from "@/components/Navbar";
import Skeleton from "@/components/Skeleton";
import { 
  User, MapPin, Package, CreditCard, Gift, Star, Bell, 
  Heart, LogOut, ChevronRight, Plus, Pencil, Trash2, Check
} from "lucide-react";
import { Suspense } from "react";

type Section = "profile" | "addresses" | "wishlist" | "orders";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  avatar_url?: string;
}

interface OrderListItem {
  id: string;
  order_number: string;
  status: string;
  total: number;
  item_count: number;
  first_item_image?: string;
  created_at: string;
}

function Avatar({ name, size = 60 }: { name: string; size?: number }) {
  const initial = name?.charAt(0).toUpperCase() || "U";
  const colors = ["#F4A41B", "#2874f0", "#ff6161", "#40c8a0", "#9b59b6"];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: size, height: size,
        backgroundColor: colors[colorIndex],
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.45, fontWeight: "bold", color: "white",
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Address>;
  onSave: (data: Omit<Address, "id" | "is_default">) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    full_name: initial?.full_name || "",
    phone: initial?.phone || "",
    address_type: initial?.address_type || "HOME",
    address_line1: initial?.address_line1 || "",
    address_line2: initial?.address_line2 || "",
    city: initial?.city || "",
    state: initial?.state || "",
    pincode: initial?.pincode || "",
    latitude: initial?.latitude || undefined as number | undefined,
    longitude: initial?.longitude || undefined as number | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setForm(f => ({ ...f, latitude, longitude }));
      
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );
        const data = await res.json();
        const addr = data.address;
        
        // Comprehensive address mapping logic
        const line1Parts = [
          addr.house_number,
          addr.road,
          addr.neighbourhood,
          addr.suburb
        ].filter(Boolean);
        
        setForm(f => ({
          ...f,
          address_line1: line1Parts.join(", "),
          address_line2: addr.city_district || addr.suburb || "",
          city: addr.city || addr.town || addr.village || addr.county || "",
          state: addr.state || "",
          pincode: addr.postcode || "",
        }));
      } catch (err) {
        console.error("Geocoding failed:", err);
      } finally {
        setLocating(false);
      }
    }, (err) => {
      console.error("Geolocation failed:", err);
      let msg = "Could not detect location.";
      if (err.code === 1) msg = "Location permission denied. Please enable it in your browser settings.";
      else if (err.code === 2) msg = "Location information is unavailable.";
      else if (err.code === 3) msg = "Location request timed out.";
      alert(msg);
      setLocating(false);
    }, { timeout: 10000, enableHighAccuracy: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary transition";

  return (
    <form onSubmit={handleSubmit} className="border border-primary rounded p-5 mt-4 bg-blue-50/30">
      <div className="flex gap-3 mb-4">
        {["HOME", "WORK", "OTHER"].map(t => (
          <button key={t} type="button"
            onClick={() => setForm(f => ({ ...f, address_type: t }))}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${form.address_type === t ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-300"}`}
          >
            {t}
          </button>
        ))}
        <button type="button" onClick={detectLocation}
          className="ml-auto flex items-center gap-1.5 text-primary text-xs font-semibold hover:underline"
        >
          <MapPin className="w-3.5 h-3.5" />
          {locating ? "Detecting..." : "Use My Location"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input required className={inputCls} placeholder="Full Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
        <input required className={inputCls} placeholder="10-digit Mobile Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <input required className={`${inputCls} col-span-2`} placeholder="Address (House No, Building, Street, Area)" value={form.address_line1} onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))} />
        <input className={`${inputCls} col-span-2`} placeholder="Locality / Town (Optional)" value={form.address_line2} onChange={e => setForm(f => ({ ...f, address_line2: e.target.value }))} />
        <input required className={inputCls} placeholder="City / District / Town" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
        <input required className={inputCls} placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
        <input required className={inputCls} placeholder="Pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
      </div>

      {form.latitude && (
        <p className="text-[11px] text-green-600 mt-2 flex items-center gap-1">
          <Check className="w-3 h-3" /> Location detected: {form.latitude.toFixed(4)}, {form.longitude?.toFixed(4)}
        </p>
      )}

      <div className="flex gap-3 mt-4">
        <button type="submit" disabled={loading}
          className="bg-accent text-white px-6 py-2 text-sm font-bold rounded-sm hover:bg-[#e85a1a] transition disabled:bg-gray-400"
        >
          {loading ? "SAVING..." : "SAVE ADDRESS"}
        </button>
        <button type="button" onClick={onCancel} className="text-primary text-sm font-semibold hover:underline">Cancel</button>
      </div>
    </form>
  );
}

function ProfilePageContent() {
  const router = useRouter();
  const { isLoggedIn, token, logout } = useAuthStore();
  const { 
    addresses, fetchAddresses, addAddress, updateAddress, 
    deleteAddress, setDefaultAddress, loading: addressLoading 
  } = useAddressStore();
  
  const searchParams = useSearchParams();
  const [section, setSection] = useState<Section>((searchParams.get("section") as Section) || "profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", gender: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/profile/me");
      setProfile(res.data);
      setProfileForm({ name: res.data.name, gender: res.data.gender || "" });
    } catch { router.push("/login"); }
  }, [router]);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get("/api/v1/orders");
      setOrders(res.data);
    } catch (err) { console.error("Failed to fetch orders:", err); }
    finally { setOrdersLoading(false); }
  }, []);


  useEffect(() => {
    const s = searchParams.get("section") as Section;
    if (s && s !== section) setSection(s);
  }, [searchParams, section]);

  const handleSectionChange = (s: Section) => {
    setSection(s);
    router.replace(`/profile?section=${s}`);
  };

  useEffect(() => {
    if (!isLoggedIn || !token) { router.push("/login"); return; }
    Promise.all([loadProfile(), fetchAddresses(), loadOrders()]).finally(() => setLoading(false));
  }, [isLoggedIn, token, loadProfile, fetchAddresses, loadOrders]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put("/api/v1/profile/me", profileForm);
    setEditingProfile(false);
    loadProfile();
  };

  const saveAddress = async (data: Omit<Address, "id" | "is_default">) => {
    if (editingAddress) {
      await updateAddress(editingAddress.id, data);
      setEditingAddress(null);
    } else {
      await addAddress(data);
      setShowAddForm(false);
    }
  };

  const removeAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await deleteAddress(id);
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-4">
         <div className="w-[260px] bg-white shadow-sm p-5 space-y-8">
            <div className="flex items-center gap-3">
               <Skeleton variant="circle" width={56} height={56} />
               <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="80%" />
               </div>
            </div>
            <div className="space-y-4 pt-10">
               {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="text" width="90%" height={32} />)}
            </div>
         </div>
         <div className="flex-1 bg-white shadow-sm p-8 space-y-6">
            <Skeleton variant="text" width="40%" height={32} />
            <div className="grid grid-cols-2 gap-4">
               <Skeleton variant="rect" width="100%" height={60} />
               <Skeleton variant="rect" width="100%" height={60} />
            </div>
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="rect" width="300px" height={100} />
         </div>
      </div>
    </div>
  );

  const navItems = [
    { label: "MY ORDERS", icon: Package, href: "/orders", isLink: true },
    { label: "ACCOUNT SETTINGS", icon: User, isGroup: true, children: [
      { label: "Profile Information", key: "profile" as Section },
      { label: "Manage Addresses", key: "addresses" as Section },
    ]},
    { label: "MY STUFF", icon: Heart, isGroup: true, children: [
      { label: "My Wishlist", key: "wishlist" as Section },
    ]},
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-4">

        {/* Left Sidebar */}
        <div className="w-[260px] flex-shrink-0">
          <div className="bg-white shadow-sm">
            {/* User Card */}
            <div className="flex items-center gap-3 p-5 border-b border-gray-100">
              <Avatar name={profile?.name || "U"} size={56} />
              <div>
                <p className="text-[12px] text-gray-500">Hello,</p>
                <p className="font-bold text-[15px] text-gray-800">{profile?.name}</p>
              </div>
            </div>

            {/* Nav */}
            <div className="py-2">
              <button onClick={() => handleSectionChange("orders")} 
                className={`w-full flex items-center justify-between px-5 py-3 transition group ${section === 'orders' ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-5 h-5 ${section === 'orders' ? 'text-primary' : 'text-primary opacity-70'}`} />
                  <span className={`text-[13px] font-bold uppercase tracking-wide ${section === 'orders' ? 'text-primary' : 'text-gray-700'}`}>My Orders</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-primary ${section === 'orders' ? 'text-primary' : ''}`} />
              </button>

              <div className="px-5 pt-3 pb-1">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Account Settings</span>
                </div>
                <div className="pl-8 space-y-0.5">
                  {["Profile Information", "Manage Addresses"].map((item, i) => {
                    const key = i === 0 ? "profile" : "addresses";
                    return (
                      <button key={key} onClick={() => handleSectionChange(key as Section)}
                        className={`w-full text-left px-2 py-2 text-[13px] rounded transition ${section === key ? "text-primary font-semibold bg-blue-50" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 pt-3 pb-1">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">My Stuff</span>
                </div>
                <div className="pl-8">
                  <Link href="/wishlist" 
                    className={`block px-2 py-2 text-[13px] rounded transition ${section === 'wishlist' ? "text-primary font-semibold bg-blue-50" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                  >
                    My Wishlist
                  </Link>
                </div>
              </div>

              <button onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-3 mt-2 border-t border-gray-100 text-red-500 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-[13px] font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-sm p-6 min-h-[500px]">

          {section === "profile" && profile && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold text-gray-800">Personal Information</h2>
                {!editingProfile && (
                  <button onClick={() => setEditingProfile(true)}
                    className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                      <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                        value={profileForm.name.split(" ")[0]}
                        onChange={e => setProfileForm(f => ({ ...f, name: e.target.value + " " + f.name.split(" ").slice(1).join(" ") }))}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
                      <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                        value={profileForm.name.split(" ").slice(1).join(" ")}
                        onChange={e => setProfileForm(f => ({ ...f, name: f.name.split(" ")[0] + " " + e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block">Your Gender</label>
                    <div className="flex gap-6">
                      {["Male", "Female", "Other"].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" value={g}
                            checked={profileForm.gender === g}
                            onChange={() => setProfileForm(f => ({ ...f, gender: g }))}
                            className="accent-primary"
                          />
                          <span className="text-sm text-gray-700">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="bg-accent text-white px-8 py-2 text-sm font-bold rounded-sm hover:bg-[#e85a1a] transition">
                      SAVE
                    </button>
                    <button type="button" onClick={() => setEditingProfile(false)} className="text-primary text-sm font-semibold hover:underline">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="border border-gray-200 rounded px-4 py-3 flex-1">
                      <p className="text-[11px] text-gray-400 mb-0.5">First Name</p>
                      <p className="text-sm text-gray-800 font-medium">{profile.name.split(" ")[0]}</p>
                    </div>
                    <div className="border border-gray-200 rounded px-4 py-3 flex-1">
                      <p className="text-[11px] text-gray-400 mb-0.5">Last Name</p>
                      <p className="text-sm text-gray-800 font-medium">{profile.name.split(" ").slice(1).join(" ") || "—"}</p>
                    </div>
                  </div>
                  {profile.gender && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Your Gender</p>
                      <div className="flex gap-6">
                        {["Male", "Female", "Other"].map(g => (
                          <label key={g} className="flex items-center gap-2">
                            <input type="radio" readOnly checked={profile.gender === g} className="accent-primary" />
                            <span className="text-sm text-gray-700">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100 mt-8 pt-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Email Address</h3>
                  </div>
                  <div className="border border-gray-200 rounded px-4 py-3 inline-block min-w-[250px]">
                    <p className="text-sm text-gray-700">{profile.email}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Mobile Number</h3>
                  </div>
                  <div className="border border-gray-200 rounded px-4 py-3 inline-block min-w-[250px]">
                    <p className="text-sm text-gray-700">{profile.phone ? `+91${profile.phone}` : "Not added"}</p>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-12">
                <h3 className="text-[16px] font-bold text-gray-900 mb-6 uppercase tracking-tight">FAQs</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-800 mb-2">What happens when I update my email address (or mobile number)?</h4>
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      Your login email id (or mobile number) changes, likewise. You&apos;ll receive all your account related communication on your updated email address (or mobile number).
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-800 mb-2">When will my Flipkart account be updated with the new email address (or mobile number)?</h4>
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Management */}
              <div className="mt-12 pt-6 border-t border-gray-100 space-y-4">
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to deactivate your account?")) {
                      await api.post("/api/v1/profile/deactivate", {});
                      logout();
                      router.push("/login");
                    }
                  }}
                  className="text-primary-blue text-sm font-bold hover:underline block"
                >
                  Deactivate Account
                </button>
                <button 
                  onClick={async () => {
                    if (confirm("DANGER: This will permanently delete your account and all data. Proceed?")) {
                      await api.delete("/api/v1/profile/delete-account");
                      logout();
                      router.push("/login");
                    }
                  }}
                  className="text-red-600 text-sm font-bold hover:underline block"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {section === "addresses" && (
            <div>
              <h2 className="text-[18px] font-semibold text-gray-800 mb-6">Manage Addresses</h2>

              {/* Add new */}
              {!showAddForm && !editingAddress && (
                <button onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center gap-2 border-2 border-dashed border-gray-300 text-primary font-semibold text-sm px-4 py-3.5 rounded hover:border-primary hover:bg-blue-50/30 transition mb-4"
                >
                  <Plus className="w-4 h-4" /> ADD A NEW ADDRESS
                </button>
              )}

              {showAddForm && (
                <AddressForm onSave={saveAddress} onCancel={() => setShowAddForm(false)} />
              )}

              {/* Address list */}
              <div className="space-y-3 mt-4">
                {addresses.map(addr => (
                  <div key={addr.id}>
                    {editingAddress?.id === addr.id ? (
                      <AddressForm initial={addr} onSave={saveAddress} onCancel={() => setEditingAddress(null)} />
                    ) : (
                      <div className="border border-gray-200 rounded p-4 relative hover:border-gray-300 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{addr.address_type}</span>
                              {addr.is_default && (
                                <span className="text-[10px] font-bold text-primary border border-primary px-2 py-0.5 rounded">DEFAULT</span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{addr.full_name} &nbsp; {addr.phone}</p>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""},&nbsp;
                              {addr.city}, {addr.state} - <span className="font-semibold">{addr.pincode}</span>
                            </p>
                            {addr.latitude && (
                              <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Location verified
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => setEditingAddress(addr)} className="text-primary hover:underline text-xs font-semibold flex items-center gap-1">
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => removeAddress(addr.id)} className="text-red-500 hover:underline text-xs font-semibold flex items-center gap-1">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                        {!addr.is_default && (
                          <button onClick={() => handleSetDefault(addr.id)}
                            className="mt-2 text-primary text-xs font-semibold hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {addresses.length === 0 && !showAddForm && (
                   <div className="text-center py-10 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm">No saved addresses found.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {section === "orders" && (
            <div className="space-y-6">
              <h2 className="text-[18px] font-semibold text-gray-800">My Orders</h2>
              
              {ordersLoading ? (
                 <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                 </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded p-4 hover:shadow-sm transition cursor-pointer flex gap-4">
                      <div className="w-20 h-20 bg-gray-50 flex-shrink-0 p-1 flex items-center justify-center border border-gray-50">
                        {order.first_item_image ? (
                          <img src={order.first_item_image} alt="Order" className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{order.order_number}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.item_count} item{order.item_count > 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">₹{order.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex items-start gap-2">
                           <div className={`w-2.5 h-2.5 mt-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-[#fb641b]'}`} />
                           <div>
                             <p className="text-sm font-bold text-gray-800 tracking-tight">{order.status}</p>
                             <p className="text-xs text-gray-500 mt-0.5">Your order has been {order.status.toLowerCase()}</p>
                           </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">You have no orders yet.</p>
                  <Link href="/" className="text-primary font-bold text-sm mt-4 inline-block hover:underline">Start Shopping</Link>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#f1f3f6]">
          <Navbar />
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
       </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
