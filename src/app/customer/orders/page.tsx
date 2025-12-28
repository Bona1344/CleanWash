"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
// import { ShoppingBag, ArrowLeft, Store } from "lucide-react";
// import Link from "next/link";
// import ReviewModal from "@/components/ReviewModal";
import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerFooter from "@/components/customer/CustomerFooter";
import ProfileSidebar from "@/components/customer/ProfileSidebar";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // const [reviewModal, setReviewModal] = useState({ show: false, shopId: "", shopName: "" });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?customerId=${user?.uid}`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white">
      <CustomerHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-white mb-8">Order History</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ProfileSidebar />

            <div className="lg:col-span-9 space-y-6">
              
              {/* Search & Filter Bar */}
              <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        type="text" 
                        placeholder="Search Order ID" 
                        className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm text-sm py-2.5" 
                    />
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2.5 w-full md:w-40 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm text-sm cursor-pointer">
                            <option>All Status</option>
                            <option>Processing</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                    </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col min-h-[400px]">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Order ID</th>
                                <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Date</th>
                                <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Shop</th>
                                <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                                <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Total</th>
                                <th scope="col" className="px-6 py-4 text-right font-semibold whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">Loading orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="bg-white dark:bg-[#1a2634] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order.id.slice(0, 8).toUpperCase()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">{order.shop?.name || "Laundry Shop"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1
                                                ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800' : 
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800' : 
                                                'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800'}`}>
                                                {order.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">₦{order.totalAmount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-bold text-[#136dec] hover:text-blue-700 text-xs uppercase tracking-wide border border-[#136dec]/20 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                                Details
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a2634]">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-bold text-gray-900 dark:text-white">1-{orders.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{orders.length}</span> orders
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
