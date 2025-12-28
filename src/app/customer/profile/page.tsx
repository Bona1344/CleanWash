"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerFooter from "@/components/customer/CustomerFooter";
import ProfileSidebar from "@/components/customer/ProfileSidebar"; // Ensure this matches path

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();
  // const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "", // Read-only
    dob: "", // Added DOB field from template
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
          name: data.name || user?.displayName || "",
          phone: data.phone || "",
          email: data.email || user?.email || "",
          dob: data.dob || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
        // Basic filter for numeric input if desired
        // const numericValue = value.replace(/\D/g, ""); 
        // setFormData((prev) => ({ ...prev, [name]: numericValue }));
        setFormData((prev) => ({ ...prev, [name]: value }));
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
          email: user?.email,
          name: formData.name,
          role: "CUSTOMER", 
          phone: formData.phone,
          dob: formData.dob,
          intent: "update"
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      // Sync with Firebase Auth Profile
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

  return (
    <div className="flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white">
      <CustomerHeader />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-white mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <ProfileSidebar />

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Personal Information Card */}
              <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal details and contact info.</p>
                  </div>
                  
                  {/* Save Button (Also functions as Submit for form) */}
                  <button 
                    onClick={(e) => handleSubmit(e as any)}
                    disabled={saving}
                    className="bg-[#136dec] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {message.text && (
                  <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
                    message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      readOnly // Email usually immutable or requires separate flow
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-gray-500 shadow-sm h-11 cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm h-11" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-[#136dec] focus:ring-[#136dec] shadow-sm h-11" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      
      <CustomerFooter />
    </div>
  );
}
