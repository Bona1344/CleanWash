"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, LogOut } from "lucide-react";
import ShopStats from "@/components/dashboard/ShopStats";
import ShopOrdersWidget from "@/components/dashboard/ShopOrdersWidget";

interface ShopOwnerDashboardProps {
  user: any;
  logout: () => Promise<void>;
}

export default function ShopOwnerDashboard({ user, logout }: ShopOwnerDashboardProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingShopData, setLoadingShopData] = useState(false);

  useEffect(() => {
    fetchShopOwnerData();
  }, [user]);

  const fetchShopOwnerData = async () => {
    setLoadingShopData(true);
    try {
        // Check if shop owner has created a shop
        const shopsRes = await fetch(`/api/shops?uid=${user?.uid}`);
        const userShops = await shopsRes.json();
        
        if (!Array.isArray(userShops) || userShops.length === 0) {
            // No shop found - redirect to shop onboarding
            router.push("/shop/onboarding");
            return;
        }
        
        const shopId = userShops[0].id;
        
        // Fetch orders for this shop
        const ordersRes = await fetch(`/api/orders?shopId=${shopId}`);
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData)) setOrders(ordersData);
    } catch (e) {
        console.error("Failed to fetch shop data", e);
    } finally {
        setLoadingShopData(false);
    }
  };

  const updateOrderStatus = async (e: React.MouseEvent, orderId: string, newStatus: string) => {
    e.stopPropagation();
    try {
        const res = await fetch("/api/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: newStatus })
        });
        if (res.ok) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
    } catch (e) {
        console.error("Failed to update status", e);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Stats Row */}
      <ShopStats orders={orders} />

      {/* 2. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Orders Widget (Takes up more space) */}
          <div className="lg:col-span-2">
              {loadingShopData ? (
                  <div className="bg-white/50 h-96 rounded-3xl animate-pulse"></div>
              ) : (
                  <ShopOrdersWidget orders={orders} onUpdateStatus={updateOrderStatus} />
              )}
          </div>

           {/* Right Column: Quick Actions */}
          <div className="space-y-6">
               {/* Shop Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-all duration-700"></div>
                
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 relative z-10">
                  <Store className="h-7 w-7" />
                  My Shop
                </h2>
                <p className="text-gray-400 mb-8 relative z-10">Management</p>
                
                <div className="space-y-3 relative z-10">
                  <button 
                    onClick={() => router.push("/shop/services")}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 text-left transition-all flex items-center justify-between group/btn backdrop-blur-md"
                  >
                    <span className="font-semibold">Services & Prices</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                  
                  <button 
                    onClick={() => router.push("/shop/onboarding")}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 text-left transition-all flex items-center justify-between group/btn backdrop-blur-md"
                  >
                    <span className="font-semibold">Edit Shop Profile</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
}
