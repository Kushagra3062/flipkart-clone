"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [step, setStep] = useState<"login" | "forgot" | "reset">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/v1/auth/login", { identifier, password });
      const token = res.data.access_token;
      // Fetch full profile to get name, phone etc.
      const profileRes = await api.get("/api/v1/profile/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuth(profileRes.data, token);
      
      // Handle redirect parameter
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/";
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/v1/auth/send-otp", { identifier });
      setStep("reset");
      setSuccess(`OTP sent to ${identifier}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/v1/auth/reset-password", { 
        identifier, 
        otp_code: otp, 
        new_password: newPassword 
      });
      setStep("login");
      setSuccess("Password updated successfully! Please log in.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Reset failed. Check OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post("/api/v1/auth/google", { id_token: credentialResponse.credential });
      setAuth(res.data.user, res.data.access_token);
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/";
      router.push(redirectTo);
    } catch (err: any) {
      setError("Google Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[850px] mx-auto mt-10 shadow-lg bg-white flex min-h-[520px]">
        
        {/* Left Side */}
        <div className="hidden md:flex w-[40%] bg-primary p-10 flex-col text-white">
          <h1 className="text-[28px] font-bold mb-4">
            {step === "login" ? "Login" : step === "forgot" ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-[18px] text-white/80 leading-relaxed font-medium">
            {step === "login" 
              ? "Get access to your Orders, Wishlist and Recommendations" 
              : "We'll help you get back to your account safely."}
          </p>
          <div className="mt-auto items-center justify-center flex opacity-30 text-center">
             <Image 
               src="https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100" 
               alt="Login Icon" 
               width={150} 
               height={150} 
               priority
               loading="eager"
             />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[60%] p-10 flex flex-col">
          
          {error && <div className="text-red-500 text-xs mb-4 p-2 bg-red-50 rounded border border-red-100">{error}</div>}
          {success && <div className="text-green-600 text-xs mb-4 p-2 bg-green-50 rounded border border-green-100">{success}</div>}

          {step === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Email/Mobile Number"
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                  required
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setStep("forgot")}
                  className="absolute right-0 bottom-2 text-primary text-xs font-semibold hover:underline"
                >
                  Forgot?
                </button>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="bg-accent text-white py-3 rounded-sm font-bold shadow-md hover:bg-[#e85a1a] transition tracking-wide disabled:bg-gray-400 uppercase"
              >
                {loading ? "LOGGING IN..." : "Login"}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-[1px] bg-gray-200 flex-1"></div>
                <span className="text-gray-400 text-xs uppercase font-bold">OR</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={() => setError("Google Login failed")}
                  width="350"
                />
              </div>

              <Link href="/signup" className="text-center text-primary font-bold text-[14px] hover:underline mt-8">
                New to Flipkart? Create an account
              </Link>
            </form>
          )}

          {step === "forgot" && (
            <form onSubmit={handleForgot} className="flex flex-col gap-8 mt-4">
              <p className="text-gray-600 text-sm">
                Enter your Email or Mobile Number linked to your account.
              </p>
              <div className="relative">
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Email/Mobile Number"
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-accent text-white py-3 rounded-sm font-bold shadow-md hover:bg-[#e85a1a] transition disabled:bg-gray-400 uppercase"
              >
                {loading ? "SENDING..." : "Continue"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep("login")}
                className="text-primary text-sm font-bold hover:underline"
              >
                Back to Login
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="flex flex-col gap-6 mt-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition text-center text-xl tracking-[10px] placeholder:tracking-normal placeholder:text-black placeholder:font-bold placeholder:text-sm"
                  required
                  maxLength={6}
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Set New Password"
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition placeholder:text-gray-500 placeholder:font-bold text-[16px] font-bold text-gray-900"
                  required
                  minLength={8}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-accent text-white py-3 rounded-sm font-bold shadow-md hover:bg-[#e85a1a] transition disabled:bg-gray-400 uppercase"
              >
                {loading ? "RESETTING..." : "Update Password"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
