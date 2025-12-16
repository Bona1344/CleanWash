"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Link from "next/link";

export default function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  
  const [email, setEmail] = useState(emailParam || "");
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // If no email param, try to get from current user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          router.push("/dashboard");
        } else {
          setEmail(user.email || "");
        }
      } else {
        // Not logged in, redirect to login if no email param to show context
        if (!emailParam) router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [emailParam, router]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendLink = async () => {
    if (cooldown > 0) return;
    
    setIsResending(true);
    setMessage("");
    setIsError(false);

    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage("Verification link sent! Check your inbox.");
        setCooldown(60);
      } else {
        setIsError(true);
        setMessage("You must be logged in to resend the link.");
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      setIsError(true);
      if (error.code === 'auth/too-many-requests') {
        setMessage("Too many requests. Please wait a bit.");
      } else {
        setMessage("Failed to send link. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const roleParam = searchParams.get("role");
  const isCustomer = roleParam === "customer";
  // Default to blue if no role, green for customer, gray for shop owner
  const buttonColorClass = roleParam 
    ? (isCustomer ? "bg-[#003d29] hover:bg-[#002a1c]" : "bg-gray-900 hover:bg-gray-800")
    : "bg-blue-600 hover:bg-blue-700";
  const iconColorClass = roleParam
    ? (isCustomer ? "text-[#003d29]" : "text-gray-900")
    : "text-blue-600";
  const iconBgClass = roleParam
      ? (isCustomer ? "bg-green-50" : "bg-gray-100")
      : "bg-blue-50";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className={`mx-auto w-16 h-16 ${iconBgClass} rounded-full flex items-center justify-center mb-6`}>
          <Mail className={`h-8 w-8 ${iconColorClass}`} />
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-gray-900">Check your email</h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          We've sent a verification link to <br />
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        {message && (
          <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => window.open('https://gmail.com', '_blank')}
            className={`w-full ${buttonColorClass} text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
          >
            Open Email App
          </button>

          <button 
            onClick={handleResendLink}
            disabled={isResending || cooldown > 0}
            className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : null}
            {cooldown > 0 ? `Resend link in ${cooldown}s` : "Click to resend link"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={async () => {
              await auth.signOut();
              router.push("/login");
            }}
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors w-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login (Clear Session)
          </button>
        </div>
      </div>
    </div>
  );
}
