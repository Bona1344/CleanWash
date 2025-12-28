"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";

export default function SignupFormPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [role, setRole] = useState<"customer" | "shop_owner">(
    roleParam === "shop_owner" ? "shop_owner" : "customer"
  );
  const [error, setError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }
    
    setIsSigningUp(true);
    setError("");
    
    try {
      // 1. Create Firebase Account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // 2. Send Verification Email
      await sendEmailVerification(userCredential.user);

      // 3. Create User in Database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: name,
          role: role,
          intent: "signup",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.shouldSignIn) {
          setError(data.error);
          await auth.signOut();
          return;
        }
        throw new Error(data.error || "Failed to create account");
      }

      // 4. Redirect based on role
      if (role === "shop_owner") {
        // Shop owners go to onboarding to fill in business details
        router.push("/shop/onboarding");
      } else {
        // Customers go to check email page
        router.push(`/check-email?email=${encodeURIComponent(email)}&role=${role}`);
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      let errorMsg = err.message || "Failed to sign up.";
      if (err.code === "auth/network-request-failed") {
        errorMsg = "Network Error: Firebase could not be reached. Please check your internet connection.";
      }
      setError(errorMsg);
      
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Please sign in instead.");
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-b-[#2a3646] bg-white dark:bg-[#101822] px-10 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
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
            <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="/shop/onboarding">
              For Shop Owners
            </Link>
            <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="/login">
              Log In
            </Link>
          </div>
          <Link href="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#136dec]/10 hover:bg-[#136dec]/20 transition-colors text-[#136dec] dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Log In</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[480px]">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/signup" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#136dec] transition-colors dark:text-gray-400">
              <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
              Back to selection
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4 text-[#136dec]">
                <span className="material-symbols-outlined text-3xl">person_add</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {role === "customer" ? "Customer Sign Up" : "Shop Owner Sign Up"}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {role === "customer" 
                  ? "Create an account to find services and track your laundry."
                  : "Create an account to manage your laundry business."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">badge</span>
                  </div>
                  <input
                    autoComplete="name"
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#136dec] sm:text-sm sm:leading-6 dark:bg-[#101822] dark:ring-gray-600 dark:text-white dark:placeholder:text-gray-500"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 mb-1.5" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                  </div>
                  <input
                    autoComplete="email"
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#136dec] sm:text-sm sm:leading-6 dark:bg-[#101822] dark:ring-gray-600 dark:text-white dark:placeholder:text-gray-500"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">lock</span>
                  </div>
                  <input
                    autoComplete="new-password"
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#136dec] sm:text-sm sm:leading-6 dark:bg-[#101822] dark:ring-gray-600 dark:text-white dark:placeholder:text-gray-500"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 mb-1.5" htmlFor="location">
                  Location
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">location_on</span>
                  </div>
                  <input
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#136dec] sm:text-sm sm:leading-6 dark:bg-[#101822] dark:ring-gray-600 dark:text-white dark:placeholder:text-gray-500"
                    id="location"
                    name="location"
                    placeholder="City or Zip Code"
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  We use this to find the best laundry shops near you.
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    className="h-4 w-4 rounded border-gray-300 text-[#136dec] focus:ring-[#136dec] dark:bg-[#101822] dark:border-gray-600 dark:checked:bg-[#136dec]"
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-700 dark:text-gray-300" htmlFor="terms">
                    I agree to the{" "}
                    <Link className="font-bold text-[#136dec] hover:text-blue-600 hover:underline" href="#">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link className="font-bold text-[#136dec] hover:text-blue-600 hover:underline" href="#">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="flex w-full justify-center rounded-lg bg-[#136dec] px-3 py-3 text-sm font-bold leading-6 text-white shadow-md hover:bg-blue-600 hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136dec] disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Already have account */}
            <div className="relative mt-8">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-4 text-gray-500 dark:bg-[#1a2634] dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link className="text-sm font-bold text-[#136dec] hover:text-blue-600 hover:underline transition-colors" href="/login">
                Log in to your account
              </Link>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 text-center flex justify-center items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Your personal information is securely encrypted.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#101822] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4 text-[#111418] dark:text-white">
                <div className="size-6 text-[#136dec]">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-bold">Ryns</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                Making laundry day easier for everyone. Find the best laundry shop and services near you with just a few clicks.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <Link key={social} className="text-gray-400 hover:text-[#136dec] transition-colors" href="#">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      {social === "facebook" && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fillRule="evenodd"></path>}
                      {social === "twitter" && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>}
                      {social === "instagram" && <path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.373c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fillRule="evenodd"></path>}
                      {social === "linkedin" && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>}
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                {["About Us", "Careers", "Location", "Press", "Blog"].map((item) => (
                  <li key={item}><Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                {["Contact", "Help Center", "Terms", "Terms of service", "Privacy policy", "FAQs"].map((item) => (
                  <li key={item}><Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">location_on</span>
                  <span>123 Laundry St,<br/>Clean City, USA</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">call</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">mail</span>
                  <span>support@ryns.com</span>
                </li>
              </ul>
            </div>

            {/* App Download */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Get The App</h4>
              <div className="flex flex-col gap-3">
                <Link className="flex items-center gap-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 p-2 transition-colors border border-black/10 dark:border-white/10" href="#">
                  <div className="flex h-8 w-8 items-center justify-center text-[#111418] dark:text-white">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.048 2.048 0 01-1.082-1.773V3.587A2.048 2.048 0 013.609 1.814zM15.938 14.146l3.666 3.666-2.226 2.226-5.875-5.875 4.435-4.435zM18.429 7.363l-2.49 2.491-4.435-4.436 5.875-5.875 1.05.62c.768.455 1.05 1.432 1.05 2.293 0 .862-.282 1.838-1.05 2.293z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase leading-none text-gray-500">Get it on</span>
                    <span className="text-sm font-bold text-[#111418] dark:text-white">Play Store</span>
                  </div>
                </Link>
                <Link className="flex items-center gap-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 p-2 transition-colors border border-black/10 dark:border-white/10" href="#">
                  <div className="flex h-8 w-8 items-center justify-center text-[#111418] dark:text-white">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.68.75 3.41 1.79-3.13 1.83-2.58 5.67.62 6.91-.45 1.17-1.07 2.45-2.62 4.33zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.41-3.74 4.25z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase leading-none text-gray-500">Download on the</span>
                    <span className="text-sm font-bold text-[#111418] dark:text-white">App Store</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2024 Ryns. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
