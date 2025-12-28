"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"customer" | "shop_owner" | null>(null);

  const handleRoleSelection = (role: "customer" | "shop_owner") => {
    setSelectedRole(role);
    // Navigate to the signup form with the role pre-selected
    router.push(`/signup/form?role=${role}`);
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
              Home
            </Link>
            <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="/login">
              Support
            </Link>
          </div>
          <Link href="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Log In</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-2xl space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em] text-[#111418] dark:text-white">
              Join Ryns - Guided Selection
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              To start, please choose the type of account that best describes you.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Customer Card */}
            <div
              onClick={() => handleRoleSelection("customer")}
              className="group relative flex flex-col items-center text-center bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-[#136dec]/50 transition-all duration-300 p-8 cursor-pointer"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[#136dec]">arrow_forward</span>
              </div>
              <div className="mb-6 flex justify-center">
                <div className="size-20 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-[#136dec]">
                  <span className="material-symbols-outlined text-4xl">person</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                I'm a Customer
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1 max-w-md">
                Find top-rated laundry services near you. Schedule pickups, track orders, and get fresh clothes delivered to your doorstep.
              </p>
              <button className="w-full max-w-xs h-12 bg-[#136dec] hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span>Select Customer Account</span>
              </button>
            </div>

            {/* Shop Owner Card */}
            <div
              onClick={() => handleRoleSelection("shop_owner")}
              className="group relative flex flex-col items-center text-center bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-[#136dec]/50 transition-all duration-300 p-8 cursor-pointer"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[#136dec]">arrow_forward</span>
              </div>
              <div className="mb-6 flex justify-center">
                <div className="size-20 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined text-4xl">storefront</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                I'm a Shop Owner
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1 max-w-md">
                Grow your business with our digital tools. Manage orders efficiently, reach new customers, and simplify payments.
              </p>
              <button className="w-full max-w-xs h-12 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                <span>Select Shop Owner Account</span>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link className="font-bold text-[#136dec] hover:underline hover:text-blue-600 transition-colors" href="/login">
                Log in here
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-8">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Your data is secure and encrypted</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#101822] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-2 text-[#111418] dark:text-white">
                <div className="size-8 text-[#136dec]">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Ryns</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                Making laundry day easier for everyone. Find the best laundry shop and services near you with just a few clicks.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { name: "twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                  { name: "instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { name: "linkedin", path: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 5.432-5.17 5.432 0v8.306h5v-10.5c0-5.352-5.19-7.121-7.926-4.172l-.538-1.328z" }
                ].map((social) => (
                  <Link
                    key={social.name}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-[#136dec] hover:text-white transition-all duration-200"
                    href="#"
                  >
                    <svg className={social.name === "twitter" ? "w-4 h-4" : "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path}></path>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                {["About Us", "Careers", "Location", "Press", "Blog"].map((item) => (
                  <li key={item}>
                    <Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                {["Contact", "Help Center", "Terms", "Terms of service", "Privacy Policy", "FAQs"].map((item) => (
                  <li key={item}>
                    <Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">location_on</span>
                  <span>123 Laundry St, Clean City, USA</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">call</span>
                  <span>+1 234 567 890</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">mail</span>
                  <Link className="hover:text-[#136dec] transition-colors" href="mailto:support@ryns.com">
                    support@ryns.com
                  </Link>
                </li>
              </ul>
            </div>

            {/* App Download */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Get The App</h4>
              <div className="flex flex-col gap-3">
                <button className="bg-[#111418] dark:bg-white text-white dark:text-[#111418] hover:opacity-90 transition-opacity rounded-lg px-4 py-2 flex items-center gap-3 w-full max-w-[180px]">
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.84L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.16L16.81,8.88L14.54,11.15L6.05,2.16Z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight opacity-80">GET IT ON</div>
                    <div className="text-sm font-bold leading-tight">Google Play</div>
                  </div>
                </button>
                <button className="bg-[#111418] dark:bg-white text-white dark:text-[#111418] hover:opacity-90 transition-opacity rounded-lg px-4 py-2 flex items-center gap-3 w-full max-w-[180px]">
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight opacity-80">Download on the</div>
                    <div className="text-sm font-bold leading-tight">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2024 Ryns. All rights reserved.</p>
            <div className="flex gap-6">
              <Link className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
                Privacy Policy
              </Link>
              <Link className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
