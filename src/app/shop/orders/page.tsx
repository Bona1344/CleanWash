"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Check, X, Package, ChevronRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
        fetchShopAndOrders();
    }
  }, [user]);

  const fetchShopAndOrders = async () => {
    try {
        const servicesRes = await fetch(`/api/services?uid=${user?.uid}`);
        const services = await servicesRes.json();
        
        let shopId;
        if (services.length > 0) {
            shopId = services[0].shopId;
        } else {
             const allShops = await fetch("/api/shops").then(r => r.json());
             const myShop = allShops.find((s: any) => s.ownerId === user?.uid);
             if (myShop) shopId = myShop.id;
        }

        if (shopId) {
            const ordersRes = await fetch(`/api/orders?shopId=${shopId}`);
            const ordersData = await ordersRes.json();
            if (Array.isArray(ordersData)) setOrders(ordersData);
        }

    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const updateStatus = async (e: React.MouseEvent, orderId: string, newStatus: string) => {
    e.stopPropagation(); // Prevent opening modal
    try {
        const res = await fetch("/api/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: newStatus })
        });
        
        if (res.ok) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
            }
        }
    } catch (e) {
        console.error("Failed to update status", e);
    }
  };

  const getItemDetails = (order: any) => {
      const items: any[] = [];
      const shopServices = order.shop?.services || [];
      
      if (order.items && typeof order.items === 'object') {
          Object.entries(order.items).forEach(([serviceId, qty]) => {
              const service = shopServices.find((s: any) => s.id === serviceId);
              if (service) {
                  items.push({ ...service, qty: Number(qty) });
              }
          });
      }
      return items;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white/50">Loading...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto relative">
        <header className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-white transition-all shadow-lg active:scale-95">
                <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">Incoming Orders</h1>
        </header>

        {orders.length === 0 ? (
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] text-center text-gray-400">
               <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
               <p className="text-lg font-medium">No active orders</p>
           </div> 
        ) : (
            <div className="space-y-4">
                {orders.map((order) => {
                    const itemCount = Object.values(order.items || {}).reduce((a: any, b: any) => a + Number(b), 0);
                    
                    return (
                        <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-[1.5rem] flex flex-col gap-4 cursor-pointer hover:bg-white/15 transition-all shadow-xl hover:shadow-2xl active:scale-[0.99] group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 border border-blue-500/30">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight">
                                            {order.customer?.name || "Customer"}
                                        </h3>
                                        <div className="flex items-center gap-2 text-white/50 text-sm mt-1">
                                            <span>{itemCount} items</span>
                                            <span>•</span>
                                            <span className="font-mono">₦{order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border backdrop-blur-md ${
                                    order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                    order.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                    order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                    'bg-red-500/20 text-red-300 border-red-500/30'
                                }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-white/40 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                
                                {order.status === 'PENDING' ? (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={(e) => updateStatus(e, order.id, 'ACCEPTED')}
                                            className="px-5 py-2 bg-white text-black rounded-full font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={(e) => updateStatus(e, order.id, 'CANCELLED')}
                                            className="px-5 py-2 bg-white/10 text-white border border-white/10 rounded-full font-bold text-sm hover:bg-white/20 transition-all"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-white/60 text-sm font-medium">
                                        View Details <ChevronRight className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* DETAILS MODAL */}
        {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                    onClick={() => setSelectedOrder(null)}
                />
                
                <div className="bg-[#1a1a2e] border border-white/10 md:rounded-[2rem] rounded-t-[2rem] w-full max-w-lg p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden"></div>
                    
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Order Details</h2>
                            <p className="text-white/50 text-sm">#{selectedOrder.id.slice(0, 8)}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedOrder(null)}
                            className="p-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-xs font-bold text-white/40 uppercase mb-2 tracking-wider">Customer</p>
                            <div className="flex justify-between text-white">
                                <span className="font-semibold">{selectedOrder.customer?.name}</span>
                                <span className="text-white/60 text-sm">{selectedOrder.customer?.email}</span>
                            </div>
                        </div>

                        {/* Items List */}
                        <div>
                            <p className="text-xs font-bold text-white/40 uppercase mb-3 tracking-wider">Items</p>
                            <div className="space-y-3">
                                {getItemDetails(selectedOrder).map((item: any, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <div className="flex gap-3">
                                            <span className="text-blue-400 font-bold">x{item.qty}</span>
                                            <span className="text-white/90">{item.name}</span>
                                        </div>
                                        <span className="text-white/60 font-mono">₦{item.price * item.qty}</span>
                                    </div>
                                ))}
                                {getItemDetails(selectedOrder).length === 0 && (
                                    <p className="text-white/30 italic text-sm">No specific item details available.</p>
                                )}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="text-white/60 font-medium">Total Amount</span>
                            <span className="text-3xl font-bold text-white">₦{selectedOrder.totalAmount}</span>
                        </div>

                        {/* Actions in Modal */}
                        {selectedOrder.status === 'PENDING' && (
                             <div className="grid grid-cols-2 gap-4 mt-4">
                                <button 
                                    onClick={(e) => {
                                        updateStatus(e, selectedOrder.id, 'ACCEPTED');
                                        setSelectedOrder(null);
                                    }}
                                    className="py-3.5 bg-white text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    Accept Order
                                </button>
                                <button 
                                    onClick={(e) => {
                                        updateStatus(e, selectedOrder.id, 'CANCELLED');
                                        setSelectedOrder(null);
                                    }}
                                    className="py-3.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        )}
                        
                         {selectedOrder.status === 'ACCEPTED' && (
                             <button 
                                onClick={(e) => {
                                    updateStatus(e, selectedOrder.id, 'COMPLETED');
                                    setSelectedOrder(null);
                                }}
                                className="w-full py-3.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                            >
                                Mark as Completed
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
