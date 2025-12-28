"use client";

import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerFooter from "@/components/customer/CustomerFooter";
import ProfileSidebar from "@/components/customer/ProfileSidebar";

export default function CustomerPreferencesPage() {
  return (
    <div className="flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white">
      <CustomerHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-white mb-8">Preferences</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ProfileSidebar />

            <div className="lg:col-span-9 space-y-6">
                <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col h-full min-h-[400px]">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Laundry Preferences</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Customize how you want your laundry handled.</p>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">Fragrance Free</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Use unscented detergents</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#136dec]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">Hypoallergenic</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">For sensitive skin</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#136dec]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">Eco Mode</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cold wash to save energy</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#136dec]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">Notifications</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Email updates on orders</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#136dec]"></div>
                            </label>
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
