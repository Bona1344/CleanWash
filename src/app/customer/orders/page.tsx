"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, ArrowLeft, Store } from "lucide-react";
import Link from "next/link";
import ReviewModal from "@/components/ReviewModal"; // Assuming this is available

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({ show: false, shopId: "", shopName: "" });

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-4 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
             <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-full transition-colors">
                 <ArrowLeft className="h-6 w-6 text-gray-700" />
             </Link>
             <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {loading ? (
             <div className="text-center py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
             <div className="glass-panel p-12 text-center text-gray-500">
                 <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                 <p>No orders yet.</p>
                 <Link href="/dashboard" className="text-blue-600 font-bold hover:underline mt-2 block">
                    Find a Laundry Shop
                 </Link>
             </div>
        ) : (
            <div className="space-y-4">
                  {orders.map(order => (
                      <div key={order.id} className="glass-card p-5 rounded-2xl flex flex-col gap-4 group">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                      <Store className="h-5 w-5" />
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-gray-900">{order.shop?.name}</h3>
                                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                                  </div>
                              </div>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-blue-100 text-blue-700'
                              }`}>
                                  {order.status}
                              </span>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                              <span className="text-gray-900 font-bold">₦{order.totalAmount}</span>
                              
                              {order.status === 'COMPLETED' && (
                                  <button 
                                      onClick={() => setReviewModal({ show: true, shopId: order.shopId, shopName: order.shop?.name })}
                                      className="text-sm text-blue-600 font-bold hover:underline"
                                  >
                                      Rate Shop
                                  </button>
                              )}
                          </div>
                      </div>
                  ))}
            </div>
        )}
      </div>

      {reviewModal.show && (
          <ReviewModal 
              shopId={reviewModal.shopId}
              shopName={reviewModal.shopName}
              customerId={user?.uid!}
              onClose={() => setReviewModal({ show: false, shopId: "", shopName: "" })}
              onSuccess={() => {
                  fetchOrders(); // Refresh to potentially show rated status? Or just unrelated.
              }}
          />
      )}
    </div>
  );
}
