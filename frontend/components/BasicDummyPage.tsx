import Navbar from "@/components/Navbar";

export default function BasicDummyPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1240px] mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
         <img src={`https://picsum.photos/seed/${title.replace(/[^a-zA-Z]/g, '')}/400/300`} alt={title} className="w-[400px] h-[300px] object-cover rounded-xl shadow-md mb-8" />
         <h1 className="text-4xl font-black text-gray-800 mb-4">{title}</h1>
         <p className="text-gray-500 max-w-lg">This is a structural demonstration page for the Flipkart Ecosystem. True features would launch dedicated progressive web apps or deep-link to partner services.</p>
      </div>
    </div>
  );
}
