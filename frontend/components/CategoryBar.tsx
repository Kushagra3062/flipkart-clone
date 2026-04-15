"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
  { name: "For You", icon: "https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100", slug: "/" },
  { name: "Fashion", icon: "https://rukminim1.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100", slug: "fashion" },
  { name: "Mobiles", icon: "https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100", slug: "mobiles" },
  { name: "Beauty", icon: "https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100", slug: "beauty" },
  { name: "Electronics", icon: "https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100", slug: "electronics" },
  { name: "Home", icon: "https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100", slug: "home" },
  { name: "Appliances", icon: "https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100", slug: "appliances" },
  { name: "Toys", icon: "https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100", slug: "toys" },
  { name: "Food", icon: "https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100", slug: "food" },
  { name: "Auto", icon: "https://rukminim1.flixcart.com/flap/128/128/image/05d708653beff580.png?q=100", slug: "auto" },
  { name: "Furniture", icon: "https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100", slug: "furniture" }
];

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="bg-white px-4 border-b border-gray-100 mt-2">
      <div className="max-w-[1300px] mx-auto overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-6 lg:gap-8 min-w-max px-2">
          {categories.map((cat, i) => {
            const isActive = (cat.slug === "/" && pathname === "/") || (cat.slug !== "/" && pathname.includes(cat.slug));
            
            return (
              <Link 
                key={i} 
                href={cat.slug === "/" ? "/" : `/category/${cat.slug}`}
                className={`flex flex-col items-center gap-2 cursor-pointer group pb-2 ${isActive ? 'border-b-2 border-primary-blue' : 'border-b-2 border-transparent hover:border-gray-200'} transition-all`}
              >
                <div className="w-[48px] h-[48px] relative lg:w-[64px] lg:h-[64px]">
                  <Image 
                    src={cat.icon} 
                    alt={cat.name} 
                    fill 
                    className="object-contain"
                    sizes="(max-width: 64px) 100vw, 64px"
                  />
                </div>
                <span className={`text-[12px] lg:text-[14px] font-semibold tracking-tight ${isActive ? 'text-primary-blue' : 'text-[#333]'} group-hover:text-primary-blue transition`}>
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
