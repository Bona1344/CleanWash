import { Package, Check, ChevronRight, X, Clock } from "lucide-react";
import { useState } from "react";

interface ShopOrdersWidgetProps {
  orders: any[];
  onUpdateStatus: (e: React.MouseEvent, orderId: string, status: string) => void;
}

export default function ShopOrdersWidget({ orders, onUpdateStatus }: ShopOrdersWidgetProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const getItemDetails = (order: any) => {
    const items: any[] = [];
    // We assume order.shop.services is populated if passed correctly, 
    // but in the page refactor we must ensure this data structure is preserved.
    // If we just pass orders, we need to ensure they have the shop.services included 
    // OR we pass services separately.
    // However, the previous logic relied on `order.shop.services` being present in the order object 
    // (which implies the fetch included it).
    
    // Safety check
    const shopServices = order.shop?.services || [];
    if (order.items && typeof order.items === 'object') {
        Object.entries(order.items).forEach(([serviceId, qty]) => {
            const service = shopServices.find((s: any) => s.id === serviceId);
            if (service) items.push({ ...service, qty: Number(qty) });
        });
    }
    return items;
  };

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 md:p-8 h-full min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Incoming Orders
            <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">{orders.length}</span>
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
             <Package className="h-12 w-12 mb-3 opacity-50" />
             <p>No active orders</p>
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
            {orders.map((order) => {
                const itemCount = Object.values(order.items || {}).reduce((a: any, b: any) => a + Number(b), 0);
                return (
                    <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="glass-card hover:bg-white/80 p-5 rounded-2xl flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md transition-all border border-white/40"
                    >
                        <div className="flex items-center gap-4">
                             <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                                 order.status === 'PENDING' ? 'bg-yellow-400' :
                                 order.status === 'ACCEPTED' ? 'bg-blue-500' :
                                 order.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-400'
                             }`}>
                                 {order.status === 'COMPLETED' ? <Check className="h-6 w-6"/> : <Package className="h-6 w-6"/>}
                             </div>
                             <div>
                                 <h3 className="font-bold text-gray-900">{order.customer?.name}</h3>
                                 <p className="text-sm text-gray-500">₦{order.totalAmount} • {itemCount} Items</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-gray-400 block">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            {order.status === 'PENDING' ? (
                                <button 
                                    onClick={(e) => onUpdateStatus(e, order.id, 'ACCEPTED')}
                                    className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:scale-105 transition-transform"
                                >
                                    Accept
                                </button>
                            ) : (
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500" />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
      )}

      {/* MODAL */}
       {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="bg-white rounded-[2rem] w-full max-w-md p-6 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Customer</p>
                        <p className="font-semibold text-gray-900">{selectedOrder.customer?.name}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.customer?.email}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Items</p>
                        <div className="space-y-2">
                             {getItemDetails(selectedOrder).map((item: any, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span><span className="font-bold text-blue-600">x{item.qty}</span> {item.name}</span>
                                    <span className="font-mono text-gray-600">₦{item.price * item.qty}</span>
                                </div>
                             ))}
                        </div>
                    </div>

                     <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-500">Total</span>
                        <span className="text-2xl font-black text-gray-900">₦{selectedOrder.totalAmount}</span>
                    </div>

                    {selectedOrder.status === 'PENDING' && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button onClick={(e) => { onUpdateStatus(e, selectedOrder.id, 'ACCEPTED'); setSelectedOrder(null); }} className="py-3 bg-black text-white rounded-xl font-bold shadow-lg">Accept</button>
                            <button onClick={(e) => { onUpdateStatus(e, selectedOrder.id, 'CANCELLED'); setSelectedOrder(null); }} className="py-3 bg-red-50 text-red-500 rounded-xl font-bold">Decline</button>
                        </div>
                    )}
                    {selectedOrder.status === 'ACCEPTED' && (
                        <button onClick={(e) => { onUpdateStatus(e, selectedOrder.id, 'COMPLETED'); setSelectedOrder(null); }} className="w-full py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-200">Complete Order</button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
