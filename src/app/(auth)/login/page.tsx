"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
            setError("Network Error: Could not reach Firebase. Check your internet connection.");
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

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-b-[#2a3646] bg-white dark:bg-[#101822] px-10 py-3">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-4" href="/">
            <div className="size-8 text-[#136dec]">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">Ryns</h2>
          </Link>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="/">
              Home
            </Link>
            <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="#">
              Support
            </Link>
          </div>
          <Link href="/signup" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Sign Up</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 py-12 md:py-20 bg-background-light dark:bg-background-dark relative">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#136dec]/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-3xl"></div>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
          {/* Left Column - Welcome & Role Selection */}
          <div className="flex flex-col justify-center space-y-8 lg:pr-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
                Welcome Back!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please select your role to continue to your dashboard.
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="cursor-pointer group relative">
                <input
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                  className="peer sr-only"
                  name="login_role"
                  type="radio"
                />
                <div className="h-full p-6 bg-white dark:bg-[#1a2634] rounded-xl border-2 border-transparent peer-checked:border-[#136dec] peer-checked:bg-blue-50/50 dark:peer-checked:bg-blue-900/10 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#136dec] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">person</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Customer</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Track orders, schedule pickups, and manage payments.</p>
                  <div className="absolute top-4 right-4 text-[#136dec] opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input
                  checked={role === "shop_owner"}
                  onChange={() => setRole("shop_owner")}
                  className="peer sr-only"
                  name="login_role"
                  type="radio"
                />
                <div className="h-full p-6 bg-white dark:bg-[#1a2634] rounded-xl border-2 border-transparent peer-checked:border-[#136dec] peer-checked:bg-blue-50/50 dark:peer-checked:bg-blue-900/10 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">storefront</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Shop Owner</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage orders, update inventory, and view reports.</p>
                  <div className="absolute top-4 right-4 text-[#136dec] opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Trust Badge */}
            <div className="hidden lg:block pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#101822] bg-gray-200" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80")', backgroundSize: 'cover'}}></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#101822] bg-gray-300" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80")', backgroundSize: 'cover'}}></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#101822] bg-gray-400" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80")', backgroundSize: 'cover'}}></div>
                </div>
                <p>Join 10,000+ users trusting Ryns</p>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Log in to your account</h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-xl">mail</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-[#101822] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#136dec] focus:border-[#136dec] sm:text-sm transition-all"
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-[#101822] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#136dec] focus:border-[#136dec] sm:text-sm transition-all"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-[#136dec] focus:ring-[#136dec] border-gray-300 rounded cursor-pointer"
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link className="font-medium text-[#136dec] hover:text-blue-500" href="#">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#136dec] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136dec] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-[#1a2634] text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-[#101822] text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  type="button"
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
                  </svg>
                </button>
                <button
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-[#101822] text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  type="button"
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C18.343 19.128 22 14.991 22 10z" fillRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link className="font-medium text-[#136dec] hover:text-blue-500" href="/signup">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#101822] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            <div className="lg:col-span-1">
              <Link className="flex items-center gap-2 mb-4" href="/">
                <div className="size-8 text-[#136dec]">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Ryns</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                Making laundry day easier for everyone. Find the best laundry shop and services near you with just a few clicks.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <Link key={social} aria-label={social} className="text-gray-400 hover:text-[#136dec] transition-colors" href="#">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      {social === "facebook" && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>}
                      {social === "twitter" && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>}
                      {social === "instagram" && <path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm-3.77 1.795c-.95.043-1.46.223-1.802.355-.453.175-.776.383-1.115.722-.338.339-.547.662-.722 1.115-.132.342-.312.852-.355 1.802-.043.95-.052 1.238-.052 3.714 0 2.474.009 2.763.052 3.714.043.95.223 1.46.355 1.802.175.453.383.776.722 1.115.339.338.662.547 1.115.722.342.132.852.312 1.802.355.95.043 1.238.052 3.714.052 2.474 0 2.763-.009 3.714-.052.95-.043 1.46-.223 1.802-.355.453-.175.776-.383 1.115-.722.339-.338.547-.662.722-1.115.132-.342.312-.852.355-1.802.043-.95.052-1.238.052-3.714 0-2.474-.009-2.763-.052-3.714-.043-.95-.223-1.46-.355-1.802-.175-.453-.383-.776-.722-1.115a2.992 2.992 0 00-1.115-.722c-.342-.132-.852-.312-1.802-.355-.95-.043-1.238-.052-3.714-.052-2.474 0-2.763.009-3.714.052zM12 5.838a6.162 6.162 0 110 12.324 6.162 6.162 0 010-12.324zm0 2.155a4.007 4.007 0 100 8.014 4.007 4.007 0 000-8.014zm5.867-3.006a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"></path>}
                      {social === "linkedin" && <path clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>}
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                {["About Us", "Career", "Location", "Press", "Blog"].map((item) => (
                  <li key={item}><Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                {["Contact", "Help center", "Terms", "Terms of service", "Privacy policy", "FAQs"].map((item) => (
                  <li key={item}><Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Contact Us</h3>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-xl mt-0.5 select-none">location_on</span>
                  <span>123 Laundry Lane, Clean City, CC 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-xl select-none">call</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-xl select-none">mail</span>
                  <Link className="hover:text-[#136dec] transition-colors" href="mailto:support@ryns.com">support@ryns.com</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Get The App</h3>
              <div className="flex flex-col gap-3">
                <button className="flex items-center bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg px-4 py-2 hover:opacity-90 transition-opacity w-full sm:w-auto">
                  <svg className="w-6 h-6 mr-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.84L14.5,12.81L16.81,15.12M20.17,10.87C20.41,11.23 20.41,11.75 20.17,12.11L18.06,13.87L15.31,11.12L18.06,8.37L20.17,10.13M16.81,8.88L14.5,11.19L6.05,2.16L16.81,8.88Z"></path></svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none mb-0.5">Get it on</div>
                    <div className="text-sm font-bold font-sans leading-none">Google Play</div>
                  </div>
                </button>
                <button className="flex items-center bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg px-4 py-2 hover:opacity-90 transition-opacity w-full sm:w-auto">
                  <svg className="w-6 h-6 mr-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.04,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z"></path></svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none mb-0.5">Download on the</div>
                    <div className="text-sm font-bold font-sans leading-none">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Ryns. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link className="hover:text-[#136dec] transition-colors" href="#">Privacy</Link>
              <Link className="hover:text-[#136dec] transition-colors" href="#">Terms</Link>
              <Link className="hover:text-[#136dec] transition-colors" href="#">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
