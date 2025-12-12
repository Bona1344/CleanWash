"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, Minus, Plus, Check } from "lucide-react";

export default function BookingPage() {
  const { user } = useAuth();
  const params = useParams(); // { shopId: string }
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (params?.shopId) {
      fetchServices(params.shopId as string);
    }
  }, [params]);

  const fetchServices = async (shopId: string) => {
    try {
      const res = await fetch(`/api/services?shopId=${shopId}`);
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (serviceId: string, change: number) => {
    setCart((prev) => {
      const current = prev[serviceId] || 0;
      const next = Math.max(0, current + change);
      const newCart = { ...prev, [serviceId]: next };
      if (next === 0) delete newCart[serviceId];
      return newCart;
    });
  };

  const calculateTotal = () => {
    return services.reduce((total, service) => {
      const qty = cart[service.id] || 0;
      return total + (service.price * qty);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!user || user.uid.includes("owner")) {
        alert("Please login as a Customer to place orders.");
        return;
    }
    
    setPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.uid,
          customerEmail: user.email,
          customerName: user.displayName || user.email?.split('@')[0] || "Customer",
          shopId: params?.shopId,
          totalAmount: calculateTotal(),
          items: cart
        }),
      });

      if (res.ok) {
        alert("Order Placed Successfully!");
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        console.error("Order failed:", errorData);
        alert(`Failed to place order: ${errorData.error || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error placing order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalAmount = calculateTotal();
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading) return <div className="p-8 text-center text-white">Loading services...</div>;

  return (
    <div className="min-h-screen pb-32">
        {/* Header */}
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/20 p-4 shadow-sm flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/50 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Select Services</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {services.length === 0 ? (
            <div className="text-center py-20 text-gray-400 glass-panel rounded-3xl">
                This shop has no services listed yet.
            </div>
        ) : (
            services.map((service) => {
                const qty = cart[service.id] || 0;
                return (
                    <div key={service.id} className={`glass-card p-6 rounded-3xl flex items-center justify-between group transition-all duration-300 ${qty > 0 ? 'border-blue-400/50 bg-blue-50/50' : ''}`}>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{service.name}</h3>
                            <p className="text-gray-500 text-sm mb-2">{service.category}</p>
                            <p className="font-bold text-blue-600">₦{service.price}</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-1.5 shadow-inner">
                            {qty > 0 && (
                                <>
                                    <button 
                                        onClick={() => updateQuantity(service.id, -1)}
                                        className="p-2.5 bg-white rounded-lg shadow-sm hover:scale-90 transition-transform text-gray-700"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="font-bold min-w-[24px] text-center text-gray-900 text-lg">{qty}</span>
                                </>
                            )}
                            <button 
                                onClick={() => updateQuantity(service.id, 1)}
                                className={`p-2.5 rounded-lg shadow-sm transition-all duration-300 ${
                                    qty === 0 
                                    ? 'bg-gray-900 text-white hover:bg-blue-600' 
                                    : 'bg-white text-gray-700 hover:scale-110'
                                }`}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                );
            })
        )}
      </div>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 z-30 pointer-events-none">
            <div className="max-w-xl mx-auto bg-gray-900/90 backdrop-blur-xl text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between pointer-events-auto border border-white/10">
                <div className="pl-2">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{totalItems} items</p>
                    <p className="text-2xl font-bold">₦{totalAmount}</p>
                </div>
                
                <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="bg-white text-gray-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                    {placingOrder ? "Processing..." : (
                        <>
                            Place Order <Check className="h-5 w-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
