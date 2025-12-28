"use client";

import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerFooter from "@/components/customer/CustomerFooter";
import ProfileSidebar from "@/components/customer/ProfileSidebar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function CustomerAddressesPage() {
  const { user } = useAuth();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
       // Fetch user address to show distinctively
       fetch(`/api/users/${user.uid}`)
          .then(res => res.json())
          .then(data => {
             if(data.address) setAddress(data.address);
          }).catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white">
      <CustomerHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-white mb-8">Saved Addresses</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ProfileSidebar />

            <div className="lg:col-span-9 space-y-6">
                <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col h-full min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                           <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Addresses</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Manage your delivery locations.</p>
                        </div>
                        <button className="text-[#136dec] hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors flex items-center gap-2">
                           <span className="material-symbols-outlined">add</span> <span className="font-bold text-sm">Add New</span>
                        </button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        {/* Static/Dynamic Address Card 1 */}
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 relative hover:border-[#136dec]/50 dark:hover:border-[#136dec]/50 transition-colors group bg-gray-50/50 dark:bg-gray-800/30">
                            <div className="flex items-start gap-3">
                                <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-[20px]">home</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Home</p>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">Default</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                        {address || "123 Laundry Lane, Clean City, WC 12345"}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button className="p-1 text-gray-400 hover:text-[#136dec] rounded"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                <button className="p-1 text-gray-400 hover:text-red-500 rounded"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                            </div>
                        </div>

                        {/* Static Address Card 2 */}
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 relative hover:border-[#136dec]/50 dark:hover:border-[#136dec]/50 transition-colors group bg-gray-50/50 dark:bg-gray-800/30">
                            <div className="flex items-start gap-3">
                                <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-[20px]">work</span>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Office</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                        456 Corporate Blvd, Suite 200<br/>Springfield, IL 62704
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button className="p-1 text-gray-400 hover:text-[#136dec] rounded"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                <button className="p-1 text-gray-400 hover:text-red-500 rounded"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
