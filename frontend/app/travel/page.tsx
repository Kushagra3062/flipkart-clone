import Navbar from "@/components/Navbar";
import { Plane, Building, Bus, ChevronRight, Percent, CheckCircle2 } from "lucide-react";

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1240px] mx-auto px-4 py-6 space-y-6">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flights */}
          <div className="bg-gradient-to-b from-blue-50 to-blue-200 rounded-3xl p-6 relative overflow-hidden h-[300px] shadow-sm hover:shadow-md transition cursor-pointer group border border-blue-100">
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Flights</h2>
                <div className="text-green-700 font-bold mt-1 text-sm bg-white/60 inline-block px-2 py-0.5 rounded">Up to 25% Off</div>
             </div>
             <Plane className="absolute -bottom-10 -right-10 w-64 h-64 text-white/50 group-hover:scale-110 transition duration-500" strokeWidth={1} />
             <div className="absolute inset-0 flex items-center justify-center pt-20">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400" alt="Flights" className="w-[80%] object-cover rounded-xl shadow-2xl group-hover:-translate-y-2 transition duration-500" />
             </div>
          </div>

          {/* Hotels */}
          <div className="bg-gradient-to-b from-purple-50 to-purple-200 rounded-3xl p-6 relative overflow-hidden h-[300px] shadow-sm hover:shadow-md transition cursor-pointer group border border-purple-100">
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Hotels</h2>
                <div className="text-green-700 font-bold mt-1 text-sm bg-white/60 inline-block px-2 py-0.5 rounded">Up to 65% Off</div>
             </div>
             <Building className="absolute -bottom-10 -right-10 w-64 h-64 text-white/50 group-hover:scale-110 transition duration-500" strokeWidth={1} />
             <div className="absolute inset-0 flex items-center justify-center pt-20">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400" alt="Hotels" className="w-[80%] object-cover rounded-xl shadow-2xl group-hover:-translate-y-2 transition duration-500" />
             </div>
          </div>

          {/* Buses */}
          <div className="bg-gradient-to-b from-cyan-50 to-cyan-200 rounded-3xl p-6 relative overflow-hidden h-[300px] shadow-sm hover:shadow-md transition cursor-pointer group border border-cyan-100">
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Buses</h2>
                <div className="text-green-700 font-bold mt-1 text-sm bg-white/60 inline-block px-2 py-0.5 rounded">Super Saver deals</div>
             </div>
             <Bus className="absolute -bottom-10 -right-10 w-64 h-64 text-white/50 group-hover:scale-110 transition duration-500" strokeWidth={1} />
             <div className="absolute inset-0 flex items-center justify-center pt-20">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400" alt="Buses" className="w-[80%] object-cover rounded-xl shadow-2xl group-hover:-translate-y-2 transition duration-500" />
             </div>
          </div>
        </div>

        {/* My Trips Bar */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex justify-between items-center shadow-sm cursor-pointer hover:shadow transition group">
           <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl"><Plane className="w-6 h-6 text-primary-blue" /></div>
              <span className="text-2xl font-bold text-gray-900">My trips</span>
           </div>
           <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-primary-blue transition translate-x-0 group-hover:translate-x-2" />
        </div>

        {/* Banners */}
        <div className="bg-white border rounded-2xl p-6 flex justify-between items-center bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-xl font-medium tracking-wide">Winter wanderlust</h3>
              <h1 className="text-4xl font-black mt-1">Explore now</h1>
           </div>
           <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600" className="w-full h-full object-cover mix-blend-overlay" />
           </div>
        </div>

        {/* Flash Sale Banner */}
        <div className="bg-[#2874f0] rounded-2xl p-8 flex shadow-md overflow-hidden relative">
           <div className="text-white z-10 w-full">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[#ffe11b] mb-4">Flash Deals (2-3PM, 8-9PM & 10PM-12AM)</h4>
              <div className="flex gap-4 overflow-x-auto pb-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="bg-white rounded-xl w-[200px] flex-shrink-0 overflow-hidden shadow">
                      <img src={`https://picsum.photos/seed/travel${i}/200/120`} className="w-full h-[120px] object-cover" />
                      <div className="bg-blue-900 text-white text-center py-2 text-sm font-bold">Flat 15% Off*</div>
                      <div className="bg-blue-800 text-white/70 text-center py-1 text-xs">Dom. Flights</div>
                   </div>
                 ))}
                 <div className="text-white font-black text-6xl italic flex items-center justify-center opacity-30 px-10">FLASH</div>
              </div>
           </div>
        </div>
        
      </div>
    </div>
  );
}
