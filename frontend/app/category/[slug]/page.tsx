"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategoryBar from "@/components/CategoryBar";
import ProductCard, { Product } from "@/components/ProductCard";
import Skeleton from "@/components/Skeleton";
import { api } from "@/lib/api";
import { ChevronDown, Filter, Star } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") || "");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/v1/categories/${slug}/products?limit=40&sort_by=${sortBy}`;
      if (minPrice) url += `&min_price=${minPrice}`;
      if (maxPrice) url += `&max_price=${maxPrice}`;
      if (minRating) url += `&min_rating=${minRating}`;
      
      const res = await api.get(url);
      setProducts(res.data.items);
    } catch (err) {
      console.error("Failed fetching category products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, sortBy, minPrice, maxPrice, minRating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`/category/${slug}?${params.toString()}`);
    
    if (key === "sort_by") setSortBy(value);
    if (key === "min_price") setMinPrice(value);
    if (key === "max_price") setMaxPrice(value);
    if (key === "min_rating") setMinRating(value);
  };

  const categoryName = typeof slug === 'string' ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Products";

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <CategoryBar />
      
      <main className="max-w-[1300px] mx-auto px-1 md:px-2 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-[280px] bg-white shadow-sm p-4 h-fit sticky top-[130px]">
            <div className="border-b pb-4 mb-4">
               <h3 className="text-[18px] font-bold text-black uppercase tracking-tight">Filters</h3>
            </div>
            
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between items-center mb-3 cursor-pointer group">
                     <span className="text-[14px] font-bold text-black uppercase">Categories</span>
                     <ChevronDown className="w-4 h-4 text-black group-hover:text-primary-blue" />
                  </div>
                  <div className="text-[14px] text-gray-800 font-bold pl-2">
                     {categoryName}
                  </div>
               </div>

               <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3 cursor-pointer group">
                     <span className="text-[14px] font-bold text-black uppercase">Price</span>
                     <ChevronDown className="w-4 h-4 text-black group-hover:text-primary-blue" />
                  </div>
                  <div className="flex items-center gap-2">
                     <select 
                      value={minPrice}
                      onChange={(e) => updateFilters("min_price", e.target.value)}
                      className="border w-full p-1 text-[13px] font-bold text-black rounded-sm focus:outline-none focus:border-primary-blue bg-white"
                     >
                        <option value="">Min</option>
                        <option value="500">₹500</option>
                        <option value="1000">₹1000</option>
                        <option value="2000">₹2000</option>
                        <option value="5000">₹5000</option>
                     </select>
                     <span className="text-black font-bold">to</span>
                     <select 
                      value={maxPrice}
                      onChange={(e) => updateFilters("max_price", e.target.value)}
                      className="border w-full p-1 text-[13px] font-bold text-black rounded-sm focus:outline-none focus:border-primary-blue bg-white"
                     >
                        <option value="">Max</option>
                        <option value="2000">₹2000</option>
                        <option value="5000">₹5000</option>
                        <option value="10000">₹10000</option>
                        <option value="50000">₹50000</option>
                        <option value="100000">₹100000+</option>
                     </select>
                  </div>
               </div>

               <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3 cursor-pointer group">
                     <span className="text-[14px] font-bold text-black uppercase">Customer Ratings</span>
                     <ChevronDown className="w-4 h-4 text-black group-hover:text-primary-blue" />
                  </div>
                  <div className="space-y-2">
                     {[4, 3, 2, 1].map(r => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer hover:text-primary-blue transition">
                           <input 
                            type="checkbox" 
                            className="w-4 h-4" 
                            checked={minRating === String(r)}
                            onChange={(e) => updateFilters("min_rating", e.target.checked ? String(r) : "")}
                           />
                           <span className="text-[14px] text-black font-semibold">{r}★ & above</span>
                        </label>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="bg-white shadow-sm p-4 mb-4">
               <div className="text-[12px] text-gray-500 mb-2">
                  Home {'>'} {categoryName}
               </div>
               <div className="flex items-center gap-2">
                  <h1 className="text-[16px] font-bold text-[#212121]">{categoryName}</h1>
                  <span className="text-[12px] text-gray-500">(Showing {products.length} products)</span>
               </div>
               
               <div className="flex gap-4 md:gap-6 mt-4 border-b border-gray-100 pb-2 overflow-x-auto no-scrollbar">
                  <span className="text-[14px] font-bold text-[#212121] whitespace-nowrap">Sort By</span>
                  {[
                    { label: 'Relevance', value: 'newest' },
                    { label: 'Popularity', value: 'rating' },
                    { label: 'Price -- Low to High', value: 'price_asc' },
                    { label: 'Price -- High to Low', value: 'price_desc' },
                    { label: 'Newest First', value: 'newest' }
                  ].map((s, i) => (
                     <button 
                      key={i} 
                      onClick={() => updateFilters("sort_by", s.value)}
                      className={`text-[14px] whitespace-nowrap ${sortBy === s.value ? 'text-primary-blue font-bold border-b-2 border-primary-blue' : 'text-[#212121]'} pb-2 hover:text-primary-blue transition px-1`}
                     >
                        {s.label}
                     </button>
                  ))}
               </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white border border-gray-100 p-4 space-y-3">
                    <Skeleton variant="rect" width="100%" height={200} />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {products.map(item => (
                  <div key={item.id} className="h-full bg-white border border-gray-100 hover:shadow-lg transition">
                    <ProductCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 text-center flex flex-col items-center justify-center shadow-sm">
                <Filter className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">No results found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setMinRating("");
                    setSortBy("newest");
                    router.replace(`/category/${slug}`);
                  }}
                  className="mt-6 bg-primary-blue text-white px-6 py-2 rounded font-bold shadow hover:bg-blue-600 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
