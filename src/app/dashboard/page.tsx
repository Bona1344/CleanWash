"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import ShopOwnerDashboard from "@/components/dashboard/ShopOwnerDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  // Real role from database
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch user role from database
  useEffect(() => {
    const fetchRole = async () => {
        if (!user) return;
        
        try {
            const res = await fetch(`/api/users/${user.uid}`);
            const data = await res.json();
            
            // Priority Check: Does the user own a shop?
            // If they have a shop, FORCE them to see the Shop Owner Dashboard.
            if (data.shop) {
                 setUserRole("SHOP_OWNER");
            } else if (data.role) {
                // Otherwise respect their assigned role
                 setUserRole(data.role);
            } else {
                // Default fallback
                setUserRole("CUSTOMER"); 
            }
        } catch (e) {
            console.error("Failed to fetch user role:", e);
        } finally {
            setRoleLoading(false);
        }
    };

    if (user) {
        fetchRole();
    }
  }, [user]);

  if (loading || roleLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isShopOwner = userRole === "SHOP_OWNER";

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">


        {isShopOwner ? <ShopOwnerDashboard user={user} logout={logout} /> : <CustomerDashboard user={user} />}
      </div>
    </div>
  );
}
