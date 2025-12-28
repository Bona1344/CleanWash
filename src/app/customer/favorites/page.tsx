"use client";

import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerFooter from "@/components/customer/CustomerFooter";
import ProfileSidebar from "@/components/customer/ProfileSidebar";
import Image from "next/image";
import { Store } from "lucide-react";

export default function FavoriteStoresPage() {
  return (
    <div className="flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white">
      <CustomerHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-white mb-8">Favorite Stores</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ProfileSidebar />

            <div className="lg:col-span-9 space-y-6">
              {/* <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col h-full min-h-[400px]"> */}
                
                 {/* Filters */}
                <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm text-sm py-2.5" 
                        placeholder="Search your favorite stores..." 
                        type="text"
                    />
                    </div>
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <div className="relative">
                            <select className="appearance-none pl-4 pr-10 py-2.5 w-full md:w-48 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm text-sm cursor-pointer">
                                <option>All Services</option>
                                <option>Wash & Fold</option>
                                <option>Dry Cleaning</option>
                                <option>Ironing</option>
                                <option>Tailoring</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                        </div>
                        <div className="relative">
                            <select className="appearance-none pl-4 pr-10 py-2.5 w-full md:w-40 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm text-sm cursor-pointer">
                                <option>Sort by Rating</option>
                                <option>Nearest First</option>
                                <option>Name (A-Z)</option>
                                <option>Newest Added</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">sort</span>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Updated Mock Data based on template */}
                    {[
                        { 
                            name: "Fresh & Clean Laundry", 
                            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMGxNevNtQP-rim1JmxT7KJqWJdPyrX0VDLp3Gz0NoevQBETw_PtxmO184Xnkns0-djdyPltsqIrkKsRlRg4vC66wwp-kEEnNkXpDC6uhiEQgib95uFhr-xLFWeWIAkQPZOH-TjTMRxipnyRrcWPWAZEEhWPDgqZd8DT8la8-mggNkabIBhyYQYWtzLJwI-RHnECSn0aDsVe64jPDzg30c9VOy7kwfk1QX-5hWfZnPlOFb6WjmtrupE6JtBBT4gwWITgBXMpRgc8X2", 
                            rating: 4.9,
                            distance: "0.8 miles",
                            tags: ["Wash & Fold", "Self Service"]
                        },
                        { 
                            name: "QuickPress Dry Cleaners", 
                            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrpqj79XWopcZalzttpwoxfj-4PgYL1wK9Mbv_AUaTVNEeTbHBSbu5Q6LTvtzf7p8U-IoEPg26Eo9ehbUSWlTRZGboR-A31KPwm0NpvcXyDQ6xbHCvh-1i6Q6kxfE62Lc0D_OxODy8UYyv-tooqBTEHaMhDXlakAmcqABq8Ug39vjHNZGYHRBo1lbJlqYUCFdBinRAGrRl4bJqp1PfuSHr4Yf0l8cgIILPIF5QPfGxAtL42ZXHroIR3LwpOxn3KLuUQZsEmwQ2CTFe", 
                            rating: 4.7,
                            distance: "1.5 miles",
                            tags: ["Dry Cleaning", "Ironing"],
                            tagColors: ["purple", "gray"]
                         },
                        { 
                            name: "EcoWash Solutions", 
                            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB70cCrrQ-AWIgaEI0sbbpNJUBUg9hqDiySYXmHqJuCl5AMFc_6opwmzm3Tl-PGnUMNhy9Z8uG7tcorWRiaOw8SRX_Tr2xYAU4SWj3iM9UsqpJt6f1P1D-kyI1p-SXu3BDOLBJMj5Uf-OCQQPdGUyborFLg4qOzevIaueGUvQCcP90wtqyluJiwD4nsgdbMHsaZ1d0mqeRSN18hpi4Gmh9PwxGZRSPwahgYyA89bz7D5cBYQyQAYGfJxgxAXA09OxZnauyrVu7TUKJB", 
                            rating: 4.8,
                            distance: "2.1 miles",
                            tags: ["Eco-Friendly", "Wash & Fold"],
                            tagColors: ["green", "blue"]
                        }
                    ].map((shop, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800">
                                <img 
                                    alt={shop.name} 
                                    className="w-full h-full object-cover" 
                                    src={shop.image}
                                />
                                <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 rounded-full text-red-500 hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined fill-current">favorite</span>
                                </button>
                                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#1a2634]/90 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm text-gray-900 dark:text-white">
                                    <span className="material-symbols-outlined text-yellow-500 text-[16px] fill-current">star</span> {shop.rating}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{shop.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span> {shop.distance}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 my-4">
                                    {shop.tags.map((tag, idx) => (
                                        <span key={idx} className={`px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button className="flex-1 bg-[#136dec] hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm">Order Now</button>
                                    <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm">Profile</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                    <button className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm">
                        Load More Stores
                    </button>
                </div>

              {/* </div> */}
            </div>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
