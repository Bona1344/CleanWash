"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store } from "lucide-react";
import Image from "next/image";
import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerFooter from "@/components/customer/CustomerFooter";
import Link from "next/link";

interface CustomerDashboardProps {
  user: any;
}

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const router = useRouter();
  // const { logout } = useAuth(); // Handled in CustomerHeader now
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  // const [reviewModal, setReviewModal] = useState({ show: false, shopId: "", shopName: "" });

  useEffect(() => {
    fetchShops();
    fetchCustomerOrders();
  }, [user]);

  const fetchCustomerOrders = async () => {
      try {
          const res = await fetch(`/api/orders?customerId=${user?.uid}`); 
          const data = await res.json();
          if (Array.isArray(data)) setCustomerOrders(data);
      } catch (e) {
          console.error("Failed to fetch customer orders", e);
      }
  };

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops");
      const data = await res.json();
      if (Array.isArray(data)) setShops(data);
    } catch (e) {
      console.error("Failed to fetch shops", e);
    }
  };

  return (
    <div className="flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white">
      <CustomerHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full"> {/* Increased max-w for search results */}
          
          {/* Breadcrumb (Optional, but good for UX) */}
          <div className="flex flex-wrap gap-2 mb-4 text-sm font-medium">
             <Link href="/dashboard" className="text-[#617289] dark:text-gray-400 hover:text-[#136dec]">Home</Link>
             <span className="text-[#617289] dark:text-gray-400">/</span>
             <span className="text-[#111418] dark:text-white">Search Results</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
               <h2 className="text-[#111418] dark:text-white tracking-tight text-[28px] font-bold leading-tight">
                   {shops.length} Laundromats near 'Downtown'
               </h2>
               <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                   {/* View Toggle */}
                   <div className="flex h-10 items-center justify-center rounded-lg bg-[#f0f2f4] dark:bg-gray-800 p-1">
                       <label className="flex cursor-pointer h-full items-center justify-center overflow-hidden rounded-md px-3 bg-white dark:bg-gray-600 shadow-sm text-[#136dec] dark:text-white text-sm font-medium transition-all">
                           <span className="material-symbols-outlined text-[18px] mr-2">format_list_bulleted</span>
                           <span className="truncate">List</span>
                           <input type="radio" name="view-toggle" value="List View" className="invisible w-0 absolute" defaultChecked />
                       </label>
                       <label className="flex cursor-pointer h-full items-center justify-center overflow-hidden rounded-md px-3 text-[#617289] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white text-sm font-medium transition-all">
                           <span className="material-symbols-outlined text-[18px] mr-2">map</span>
                           <span className="truncate">Map</span>
                           <input type="radio" name="view-toggle" value="Map View" className="invisible w-0 absolute" />
                       </label>
                   </div>
                   
                   {/* Sort Dropdown */}
                   <div className="relative">
                       <select className="h-10 pl-3 pr-8 rounded-lg border-none bg-[#f0f2f4] dark:bg-gray-800 text-[#111418] dark:text-white text-sm font-medium focus:ring-1 focus:ring-[#136dec] cursor-pointer appearance-none">
                           <option>Recommended</option>
                           <option>Price: Low to High</option>
                           <option>Rating: High to Low</option>
                           <option>Distance: Nearest</option>
                       </select>
                       <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#617289]">expand_more</span>
                   </div>
               </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Filters */}
              <aside className="hidden lg:block lg:col-span-3">
                  <div className="sticky top-24 space-y-8 pr-4">
                      
                      {/* Service Type */}
                      <div className="flex flex-col gap-3">
                          <h3 className="text-[#111418] dark:text-white text-base font-bold leading-normal">Service Type</h3>
                          <div className="flex flex-col gap-2">
                              {["Wash & Fold", "Dry Cleaning", "Ironing", "Self-Service"].map((service) => (
                                  <label key={service} className="flex items-center gap-3 cursor-pointer group">
                                      <div className="relative flex items-center">
                                          <input type="checkbox" className="peer h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-[#136dec] focus:ring-[#136dec] bg-white dark:bg-gray-800" />
                                      </div>
                                      <span className="text-[#111418] dark:text-gray-300 text-sm font-medium group-hover:text-[#136dec] transition-colors">{service}</span>
                                  </label>
                              ))}
                          </div>
                      </div>

                      <hr className="border-[#e5e7eb] dark:border-gray-700" />

                      {/* Rating */}
                      <div className="flex flex-col gap-3">
                          <h3 className="text-[#111418] dark:text-white text-base font-bold leading-normal">Rating</h3>
                          <div className="flex flex-col gap-2">
                              <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="radio" name="rating" className="h-4 w-4 border-gray-300 dark:border-gray-600 text-[#136dec] focus:ring-[#136dec] bg-white dark:bg-gray-800" />
                                  <div className="flex items-center gap-1 text-[#111418] dark:text-gray-300">
                                      <span className="text-sm font-medium">4.5 & up</span>
                                      <span className="material-symbols-outlined text-[16px] text-yellow-500 fill-current">star</span>
                                  </div>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="radio" name="rating" className="h-4 w-4 border-gray-300 dark:border-gray-600 text-[#136dec] focus:ring-[#136dec] bg-white dark:bg-gray-800" />
                                  <div className="flex items-center gap-1 text-[#111418] dark:text-gray-300">
                                      <span className="text-sm font-medium">4.0 & up</span>
                                      <span className="material-symbols-outlined text-[16px] text-yellow-500 fill-current">star</span>
                                  </div>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="radio" name="rating" className="h-4 w-4 border-gray-300 dark:border-gray-600 text-[#136dec] focus:ring-[#136dec] bg-white dark:bg-gray-800" defaultChecked />
                                  <div className="flex items-center gap-1 text-[#111418] dark:text-gray-300">
                                      <span className="text-sm font-medium">Any</span>
                                  </div>
                              </label>
                          </div>
                      </div>

                      <hr className="border-[#e5e7eb] dark:border-gray-700" />

                      {/* Price Range */}
                      <div className="flex flex-col gap-3">
                          <h3 className="text-[#111418] dark:text-white text-base font-bold leading-normal">Price Range</h3>
                          <div className="flex items-center gap-2">
                              <button className="flex-1 py-2 px-3 rounded-lg border border-[#e5e7eb] dark:border-gray-700 hover:border-[#136dec] text-sm font-medium text-[#111418] dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-[#136dec]/5 transition-all">$</button>
                              <button className="flex-1 py-2 px-3 rounded-lg border border-[#136dec] bg-[#136dec]/10 text-[#136dec] text-sm font-bold transition-all">$$</button>
                              <button className="flex-1 py-2 px-3 rounded-lg border border-[#e5e7eb] dark:border-gray-700 hover:border-[#136dec] text-sm font-medium text-[#111418] dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-[#136dec]/5 transition-all">$$$</button>
                          </div>
                      </div>
                  </div>
              </aside>

              {/* Main Content (Shop Grid) */}
              <main className="col-span-1 lg:col-span-9">
                  {shops.length === 0 ? (
                      <div className="text-center py-20 bg-gray-50 rounded-3xl col-span-full">
                          <Store className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">No laundromats found nearby.</p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {shops.map((shop) => (
                              <div key={shop.id} className="group flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1a2634] shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer" onClick={() => router.push(`/book/${shop.id}`)}>
                                  {/* Image Section */}
                                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                      {/* Placeholder Image Logic */}
                                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 group-hover:scale-105 transition-transform duration-500">
                                          <Store className="h-16 w-16" />
                                      </div>
                                      {/* Use next/image if shop.imageUrl exists eventually */}
                                      {/* <Image ... /> */}
                                      
                                      <div className="absolute top-3 right-3 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-sm cursor-pointer hover:text-red-500 transition-colors z-10" onClick={(e) => { e.stopPropagation(); /* Add favorite logic */ }}>
                                          <span className="material-symbols-outlined text-[20px]">favorite</span>
                                      </div>
                                      
                                      {/* Example Badge (Static for now, could be dynamic) */}
                                      <div className="absolute bottom-3 left-3">
                                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Open Now</span>
                                      </div>
                                  </div>

                                  {/* Content Section */}
                                  <div className="flex flex-1 flex-col p-4">
                                      <div className="flex justify-between items-start mb-1">
                                          <h3 className="text-lg font-bold text-[#111418] dark:text-white line-clamp-1 group-hover:text-[#136dec] transition-colors">{shop.name}</h3>
                                      </div>
                                      
                                      <div className="flex items-center gap-1 mb-3">
                                          <span className="material-symbols-outlined text-[16px] text-yellow-500 fill-current">star</span>
                                          <span className="text-sm font-bold text-[#111418] dark:text-gray-200">{shop.rating?.toFixed(1) || "New"}</span>
                                          <span className="text-sm text-[#617289] dark:text-gray-400">({shop._count?.reviews || 0} reviews)</span>
                                          <span className="mx-1 text-[#617289]">•</span>
                                          <span className="text-sm text-[#617289] dark:text-gray-400">0.8 miles</span>
                                      </div>

                                      <div className="flex flex-wrap gap-2 mb-4">
                                          <span className="inline-flex items-center rounded-full bg-[#f0f2f4] dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-[#111418] dark:text-gray-300">Wash & Fold</span>
                                          <span className="inline-flex items-center rounded-full bg-[#f0f2f4] dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-[#111418] dark:text-gray-300">Dry Cleaning</span>
                                      </div>

                                      <div className="mt-auto flex items-center justify-between border-t border-[#f0f2f4] dark:border-gray-700 pt-4">
                                          <div className="flex flex-col">
                                              <span className="text-xs text-[#617289] dark:text-gray-400">Starting at</span>
                                              <span className="text-base font-bold text-[#111418] dark:text-white">${((shop._count?.services || 1) * 1.50).toFixed(2)}<span className="text-sm font-normal text-[#617289]">/lb</span></span>
                                          </div>
                                          <button className="rounded-lg bg-[#136dec] px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-colors">
                                              Details
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
                  
                  {/* Load More Button */}
                  {shops.length > 0 && (
                      <div className="flex justify-center mt-12 mb-8">
                          <button className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 text-sm font-bold text-[#111418] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-gray-700 transition-colors">
                              <span>Show More Results</span>
                              <span className="material-symbols-outlined text-[20px]">expand_more</span>
                          </button>
                      </div>
                  )}
              </main>
          </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
