import { X, MapPin, Plus, Check, ChevronLeft, LocateFixed } from "lucide-react";
import { useAddressStore } from "@/store/addressStore";
import { useEffect, useState } from "react";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddressModal({ isOpen, onClose }: AddressModalProps) {
  const { addresses, fetchAddresses, selectedAddressId, setSelectedAddress, addAddress } = useAddressStore();
  const [mode, setMode] = useState<"select" | "add">("select");
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    full_name: "", phone: "", pincode: "", city: "", state: "",
    address_line1: "", address_line2: "", address_type: "HOME"
  });

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
      setMode("select");
    }
  }, [isOpen, fetchAddresses]);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
        const data = await res.json();
        const addr = data.address;
        const line1Parts = [addr.house_number, addr.road, addr.neighbourhood].filter(Boolean);
        setForm(f => ({
          ...f,
          address_line1: line1Parts.join(", "),
          city: addr.city || addr.town || addr.village || "",
          state: addr.state || "",
          pincode: addr.postcode || "",
        }));
      } catch (err) { console.error(err); }
      finally { setLocating(false); }
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

  const onAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress(form);
    setMode("select");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-xl rounded shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-primary text-white">
          <div className="flex items-center gap-3">
             {mode === "add" && <button onClick={() => setMode("select")} className="hover:bg-white/10 p-1 rounded-full"><ChevronLeft className="w-5 h-5" /></button>}
             <h2 className="text-[17px] font-bold uppercase tracking-wide">
                {mode === "select" ? "Select Delivery Address" : "Add New Address"}
             </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
             <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f5faff]">
          {mode === "select" ? (
             <div className="space-y-4">
               {addresses.map((addr) => (
                 <div 
                   key={addr.id}
                   onClick={() => setSelectedAddress(addr.id)}
                   className={`p-5 border rounded-sm cursor-pointer transition flex items-start gap-4 bg-white shadow-sm ${selectedAddressId === addr.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                 >
                   <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary' : 'border-gray-300'}`}>
                     {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                   </div>
                   
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                       <span className="font-bold text-[14px] text-gray-900">{addr.full_name}</span>
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase">{addr.address_type}</span>
                       <span className="font-bold text-[14px] text-gray-900 ml-auto">{addr.phone}</span>
                     </div>
                     <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
                       {addr.address_line1}, {addr.address_line2 ? `${addr.address_line2}, ` : ''}{addr.city}, {addr.state} - <span className="font-bold text-gray-900">{addr.pincode}</span>
                     </p>
                     
                     {selectedAddressId === addr.id && (
                        <button onClick={onClose} className="bg-[#fb641b] text-white px-10 py-3 text-sm font-bold rounded-sm shadow-md uppercase tracking-wide hover:bg-[#eb5a13] transition">
                           Deliver Here
                        </button>
                     )}
                   </div>
                 </div>
               ))}

               {addresses.length === 0 && (
                 <div className="text-center py-10 bg-white border border-dashed rounded underline-offset-4 decoration-gray-300">
                    <p className="text-gray-400 text-sm">No saved addresses found.</p>
                 </div>
               )}

               <button 
                 onClick={() => setMode("add")}
                 className="w-full flex items-center justify-start gap-3 p-4 bg-white border border-gray-200 text-primary font-bold text-sm hover:shadow transition group"
               >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition" /> <span>ADD A NEW ADDRESS</span>
               </button>
             </div>
          ) : (
            <form onSubmit={onAddSubmit} className="space-y-6">
               <button 
                 type="button" 
                 onClick={detectLocation}
                 disabled={locating}
                 className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-white font-bold text-sm rounded shadow hover:bg-blue-600 transition disabled:opacity-70"
               >
                 <LocateFixed className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} /> 
                 {locating ? "LOCATING..." : "USE MY CURRENT LOCATION"}
               </button>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                     <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-primary transition" placeholder="Name" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                     <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-primary transition" placeholder="10-digit mobile number" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                     <input required value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-primary transition" placeholder="6-digit Pincode" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">City / Town</label>
                     <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-primary transition" placeholder="City" />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Address Line 1 (Area and Street)</label>
                  <input required value={form.address_line1} onChange={e => setForm({...form, address_line1: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-primary transition" placeholder="House No., Building, Street, Area" />
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Address Type</label>
                  <div className="flex gap-4">
                     {["HOME", "WORK"].map(type => (
                       <label key={type} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="addr_type" checked={form.address_type === type} onChange={() => setForm({...form, address_type: type})} className="w-4 h-4 accent-primary" />
                          <span className={`text-sm font-medium ${form.address_type === type ? 'text-primary' : 'text-gray-600'}`}>{type}</span>
                       </label>
                     ))}
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-accent text-white font-bold py-4 rounded-sm shadow-md uppercase tracking-wider hover:bg-[#e85a1a] transition">
                     Save and Deliver Here
                  </button>
                  <button type="button" onClick={() => setMode("select")} className="flex-1 border border-gray-200 text-gray-600 font-bold py-4 rounded-sm hover:bg-gray-50 transition uppercase">
                     Cancel
                  </button>
               </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
