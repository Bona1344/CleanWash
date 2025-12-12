"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { User, Phone, MapPin, Loader2, Save, ArrowLeft, Mail, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "", // Read-only or editable? Typically read-only from Auth, but we can save contact email.
    address: "",
    age: "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${user?.uid}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || user?.email || "",
          address: data.address || "",
          age: data.age?.toString() || "",
          description: data.description || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Strict number validation for phone
    if (name === "phone") {
        const numericValue = value.replace(/\D/g, ""); // Remove non-digits
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
        return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid,
          email: user?.email, // Keep underlying auth email consistent
          name: formData.name,
          role: "CUSTOMER", 
          phone: formData.phone,
          address: formData.address,
          age: formData.age,
          description: formData.description,
          intent: "update"
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      // Sync with Firebase Auth Profile (Global State)
      if (user && formData.name !== user.displayName) {
          try {
             await updateProfile(user, { displayName: formData.name });
             await refreshUser(); 
          } catch (firebaseErr) {
             console.error("Failed to sync name to Firebase:", firebaseErr);
          }
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-4 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
             <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-full transition-colors">
                 <ArrowLeft className="h-6 w-6 text-gray-700" />
             </Link>
             <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="glass-panel p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner border-2 border-white">
                    {user?.displayName?.[0] || formData.name?.[0] || "U"}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.displayName || "Customer"}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                    message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Full Name (Phone name) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                {/* 2. Phone Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                            placeholder="08012345678"
                            inputMode="numeric"
                        />
                    </div>
                </div>

                {/* 3. Email Accounts / Location (Address) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={true} // Usually email from auth is fixed
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="25"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px] text-gray-900 placeholder:text-gray-400"
                            placeholder="123 Laundry Lane, Lagos"
                        />
                    </div>
                </div>

                {/* 5. Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description / Bio</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] text-gray-900 placeholder:text-gray-400"
                            placeholder="A bit about yourself..."
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 "
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
