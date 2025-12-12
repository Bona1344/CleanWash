"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Store, Phone, Mail, MapPin, FileText } from "lucide-react";

export default function ShopOnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ownerId: user?.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create shop");
      }

      console.log("✅ Shop created successfully:", data);
      // Force refresh to ensure dashboard sees the new shop
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("❌ Error creating shop:", error);
      setError(error.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center items-center">
      <div className="max-w-2xl w-full glass-panel p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-100 rounded-3xl mb-4">
            <Store className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your Laundry Shop</h1>
          <p className="text-gray-600">
            Tell us about your business so customers can find you.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g., CleanPro Laundry"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                required
                placeholder="+234 800 000 0000"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="contact@shop.com"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Shop Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                placeholder="123 Main Street, Lagos, Nigeria"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <textarea
                placeholder="Tell customers about your services, specialties, operating hours..."
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Creating Your Shop..." : "Create Shop & Continue"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          You can edit these details anytime from your dashboard
        </p>
      </div>
    </div>
  );
}
