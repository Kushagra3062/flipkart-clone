import Navbar from "@/components/Navbar";
import { ChevronDown } from "lucide-react";

export default function MinutesPage() {
  const groceries = [
    { name: "Fruits & Vegetables", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300" },
    { name: "Atta, Rice & Dal", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300" },
    { name: "Oil, Ghee & Masala", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300" },
    { name: "Dairy, Bread & Eggs", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=300" },
    { name: "Cereals & Dry Fruits", img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=300" },
    { name: "Chicken, Meat & Fish", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300" },
    { name: "Instant & Frozen Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300" },
  ];

  const snacks = [
    { name: "Chips & Namkeens", img: "https://picsum.photos/seed/chips3/300/300" },
    { name: "Ice Creams", img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=300" },
    { name: "Drinks & Juices", img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=300" },
    { name: "Sweets & Chocolates", img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=300" },
    { name: "Tea, Coffee & Drinks", img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=300" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="border border-pink-200 rounded-3xl p-6 bg-pink-50/30 flex justify-between items-center shadow-sm cursor-pointer mb-8">
           <div>
              <h2 className="text-2xl font-medium text-gray-900"><span className="font-bold">Share your location</span> to access Minutes & explore</h2>
              <p className="text-xl text-gray-700">offers trending in your area.</p>
           </div>
           <ChevronDown className="w-8 h-8 text-gray-600" />
        </div>

        <div className="mb-8 border-b pb-2">
           <h3 className="text-lg font-bold text-center">Grocery</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
           {groceries.map((item, i) => (
             <div key={i} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition border border-gray-100 hover:border-gray-200">
                <h4 className="font-bold text-gray-800 text-center text-lg leading-tight mb-4">{item.name}</h4>
                <div className="flex-1 w-full flex items-end justify-center">
                   <img src={item.img} className="w-32 h-32 object-cover rounded-xl shadow-lg mix-blend-multiply" alt={item.name} />
                </div>
             </div>
           ))}
        </div>

        <div className="mb-8 border-t border-b py-2">
           <h3 className="text-lg font-bold text-center">Snacks & Drinks</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {snacks.map((item, i) => (
             <div key={i} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition border border-gray-100 hover:border-gray-200">
                <h4 className="font-bold text-gray-800 text-center text-lg leading-tight mb-4">{item.name}</h4>
                <div className="flex-1 w-full flex items-end justify-center">
                   <img src={item.img} className="w-32 h-32 object-cover rounded-xl shadow-lg mix-blend-multiply" alt={item.name} />
                </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}
