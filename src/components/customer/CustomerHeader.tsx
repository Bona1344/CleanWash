"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CustomerHeader() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-b-[#2a3646] bg-white dark:bg-[#101822] px-10 py-3">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-4 text-[#111418] dark:text-white">
          <div className="size-8 text-[#136dec]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">Rynse</h2>
        </Link>
        <label className="flex flex-col min-w-40 !h-10 max-w-64 hidden md:flex">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#617289] flex border-none bg-[#f0f2f4] dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </div>
            <input 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] dark:bg-gray-800 focus:border-none h-full placeholder:text-[#617289] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
              placeholder="Search location or service" 
              defaultValue="Downtown" 
            />
          </div>
        </label>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <div className="hidden md:flex items-center gap-6">
          <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="#">Services</Link>
          <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="#">Pricing</Link>
        </div>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-[#136dec] dark:text-gray-400 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link href="/customer/profile" className="flex items-center gap-2 cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 dark:border-gray-700">
              <img 
                alt="Profile" 
                className="h-full w-full object-cover" 
                src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuB6PNe6hF-5bj6lcdPfPOamGc6zL-GrMDW-eeprYps_POwHlpv-SPqrpDNs008ORiDeBztkhvejAC2kqRUzBvIP5XDUC07R4VcfCSfsm3-1FvXTLWqS_RaZ4_VkFG5NEuSwNiubRhZZTWe8vAPcjD4bCR_QSB5bU-w8omrjX6HyKd6QD7qRVk5yGthjBjAK8EsNngTp_r6YRsK9uzfQUG4lZJVSRpKkl4-qjje2UpDq8TTh4uGb9qkRmV0QicHnkme-FSp4dqkJJ4ty"}
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
