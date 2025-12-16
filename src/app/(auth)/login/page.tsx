"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, User, Store } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [role, setRole] = useState<"customer" | "shop_owner">("customer");
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Strict Role Check after Firebase Auth
      try {
          const res = await fetch(`/api/users/${userCredential.user.uid}`);
          if (!res.ok) {
              if (res.status === 404) {
                 // Account exists in Firebase but NOT in DB (rare sync issue or new role needed)
                 throw new Error(role === "customer" 
                    ? "This account does not exist as a customer. Please create a customer account."
                    : "This account does not exist as a shop owner. Please create a shop owner account.");
              }
              throw new Error("Failed to verify account details.");
          }
          
          const dbUser = await res.json();
          const targetRole = role === "shop_owner" ? "SHOP_OWNER" : "CUSTOMER";
          
          // Use Strict Role Check
          if (dbUser.role !== targetRole) {
               // If trying to login as Shop Owner but role is Customer
               if (dbUser.role === "CUSTOMER" && role === "shop_owner") {
                   throw new Error("This account exists as a Customer. Please sign in as a Customer.");
               }
               // If trying to login as Customer but role is Shop Owner
               if (dbUser.role === "SHOP_OWNER" && role === "customer") {
                   throw new Error("This account is registered as a Shop Owner. Please sign in as a Shop Owner.");
               }
               
               // Fallback strict check
               throw new Error(role === "customer" 
                    ? "This account does not exist as a customer. Please create a customer account."
                    : "This account does not exist as a shop owner. Please create a shop owner account.");
          }
          
      } catch (validationErr: any) {
          await auth.signOut(); // Force logout if validation fails
          setError(validationErr.message);
          return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
           setError(role === "customer" 
            ? "This account does not exist as a customer. Please create a customer account."
            : "This account does not exist as a shop owner. Please create a shop owner account.");
      } else {
          // Improved error message for network issues
          if (err.code === "auth/network-request-failed") {
            setError("Network Error: Could not reach Firebase. Check your internet connection or try the Network Debugger below.");
          } else {
            setError(err.message || "Failed to login.");
          }
      }
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      // Google Login also needs strict check?
      // Usually Google Login is "Sign Up OR Sign In". 
      // If user wants strict separation, we must check DB.
      
      const res = await fetch(`/api/users/${userCredential.user.uid}`);
      if (res.ok) {
           const dbUser = await res.json();
           const targetRole = role === "shop_owner" ? "SHOP_OWNER" : "CUSTOMER";
           
           if (dbUser.role !== targetRole) {
               // Mismatch!
               await auth.signOut();
               setError(role === "customer" 
                    ? "This account does not exist as a customer. Please create a customer account."
                    : "This account does not exist as a shop owner. Please create a shop owner account.");
               return;     
           }
      } else if (res.status === 404) {
           // New user trying to "Log In" via Google? 
           // If it's the Login Page, we might want to allow auto-signup OR strict "User not found".
           // Context: "Continue with Google" is on Login Page. 
           // User said: "If someone is not registered... give them a promise that this account does not exist"
           await auth.signOut();
           setError(role === "customer" 
                ? "This account does not exist as a customer. Please create a customer account."
                : "This account does not exist as a shop owner. Please create a shop owner account.");
           return;
      }

      router.push("/dashboard"); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login with Google.");
    }
  };

  const isCustomer = role === "customer";
  const themeColor = isCustomer ? "green" : "gray";
  const themeBg = isCustomer ? "bg-[#003d29] hover:bg-[#002a1c]" : "bg-gray-900 hover:bg-gray-800";
  const themeBorder = isCustomer ? "border-[#003d29]" : "border-gray-800";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 text-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to manage your laundry</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === "customer"
                  ? "bg-[#003d29] border-[#003d29] text-white shadow-lg"
                  : "bg-white/50 border-gray-200 text-gray-500 hover:bg-white/80"
              }`}
            >
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("shop_owner")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === "shop_owner"
                  ? "bg-gray-900 border-gray-800 text-white shadow-lg"
                  : "bg-white/50 border-gray-200 text-gray-500 hover:bg-white/80"
              }`}
            >
              <Store className="h-6 w-6" />
              <span className="text-sm font-medium">Shop Owner</span>
            </button>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full ${themeBg} text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
          >
            {isLoggingIn ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <div className="h-px bg-gray-200 w-full"></div>
          <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
          <div className="h-px bg-gray-200 w-full"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-8 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className={`font-bold hover:underline ${isCustomer ? 'text-[#003d29]' : 'text-gray-900'}`}>
            Sign Up
          </Link>
        </p>

        <NetworkDebugger />
      </div>
    </div>
  );
}
