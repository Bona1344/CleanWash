"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash2, Shirt, DollarSign } from "lucide-react";

export default function ShopServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // New Service Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Clothing");

  const categories = ["Clothing", "Bedding", "Curtains", "Shoes", "Suits", "Others"];

  useEffect(() => {
    if (user?.uid) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const res = await fetch(`/api/services?uid=${user?.uid}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (error) {
      console.error("Failed to load services", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name,
          price: parseFloat(price),
          category,
        }),
      });

      if (res.ok) {
        // Refresh list
        await fetchServices();
        // Reset form
        setName("");
        setPrice("");
      } else {
        alert("Failed to add service");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading services...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
        <p className="text-gray-600 mb-8">Set your prices for each garment type.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Service Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Add New Item
              </h2>
              
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. White Shirt"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">₦</span>
                    <input
                      type="number"
                      placeholder="500"
                      className="w-full border rounded-lg p-2.5 pl-8 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {submitting ? "Adding..." : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add to List
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* List Services */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Price List</h2>
            
            {services.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                <Shirt className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                No services added yet. Start by adding a garment!
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map((service) => (
                  <div key={service.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Shirt className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-gray-900 text-lg">₦{service.price}</span>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
