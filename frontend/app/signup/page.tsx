"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import { GoogleLogin } from "@react-oauth/google";

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        // Direct signup without OTP verification
        const res = await api.post("/api/v1/auth/signup", { name, email, phone, password });
        const token = res.data.access_token;
        
        // Fetch full profile to hydrate store
        const profileRes = await api.get("/api/v1/profile/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAuth(profileRes.data, token);
        router.push("/");
      } catch (err: any) {
        setError(err.response?.data?.detail || "Signup failed. Account may already exist.");
      } finally {
        setLoading(false);
      }
    };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post("/api/v1/auth/google", { id_token: credentialResponse.credential });
      setAuth(res.data.user, res.data.access_token);
      router.push("/");
    } catch (err: any) {
      setError("Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[850px] mx-auto mt-10 shadow-lg bg-white flex min-h-[520px]">
        
        <div className="hidden md:flex w-[40%] bg-primary p-10 flex-col text-white">
          <h1 className="text-[28px] font-bold mb-4 whitespace-pre-line">
            Join the{"\n"}Flipkart Clone
          </h1>
          <p className="text-[18px] text-white/80 leading-relaxed font-medium">
            Sign up with your mobile number to get started
          </p>
          <div className="mt-auto items-center justify-center flex opacity-30">
             <Image 
               src="https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100" 
               alt="Signup Icon" 
               width={150} 
               height={150} 
               priority
               loading="eager"
             />
          </div>
        </div>

        <div className="w-full md:w-[60%] p-10 flex flex-col justify-center">
          {error && <div className="text-red-500 text-xs mb-4 p-2 bg-red-50 rounded border border-red-100">{error}</div>}

          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <div className="relative">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                required
              />
            </div>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                required
              />
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Mobile Number"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                required
                minLength={8}
              />
            </div>

            <p className="text-[12px] text-gray-500 mt-2">
              By continuing, you agree to Flipkart's <span className="text-primary hover:underline cursor-pointer">Terms of Use</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
            </p>

            <button 
              type="submit" 
              disabled={loading}
              className="bg-accent text-white py-3 rounded-sm font-bold shadow-md hover:bg-[#e85a1a] transition tracking-wide disabled:bg-gray-400 uppercase"
            >
              {loading ? "SINGING UP..." : "Continue"}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] bg-gray-200 flex-1"></div>
              <span className="text-gray-400 text-xs uppercase font-bold">OR</span>
              <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => setError("Google signup failed")}
                width="350"
              />
            </div>

            <Link href="/login" className="bg-white text-primary py-3 rounded-sm font-bold shadow hover:bg-gray-50 transition border border-gray-100 text-center uppercase tracking-wide mt-4">
              Existing User? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
