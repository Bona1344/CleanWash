import { TrendingUp, Users, ShoppingBag, CreditCard } from "lucide-react";

interface ShopStatsProps {
  orders: any[];
}

export default function ShopStats({ orders }: ShopStatsProps) {
  // Calculate Stats
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  
  const activeOrders = orders.filter((o) => o.status === "PENDING" || o.status === "ACCEPTED").length;
  
  // distinct customers
  const uniqueCustomers = new Set(orders.map(o => o.customerId)).size;

  const stats = [
    {
      label: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "from-green-500 to-emerald-700",
      bg: "bg-green-50 text-green-700",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-700",
      bg: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Customers",
      value: uniqueCustomers,
      icon: Users,
      color: "from-purple-500 to-violet-700",
      bg: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/50">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          {/* Decorative Gradient Blob */}
          <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
        </div>
      ))}
    </div>
  );
}
