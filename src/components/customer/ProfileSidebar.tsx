"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef } from "react";
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "@/lib/firebaseClient";
import { Loader2 } from "lucide-react";

export default function ProfileSidebar() {
  const { user, logout, refreshUser } = useAuth();
  const pathname = usePathname();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    {
      label: "Personal Info",
      href: "/customer/profile",
      icon: "person",
    },
    {
      label: "Order History",
      href: "/customer/orders",
      icon: "receipt_long",
    },
    {
      label: "Favorite Stores",
      href: "/customer/favorites",
      icon: "storefront",
    },
    {
      label: "Saved Addresses",
      href: "/customer/addresses",
      icon: "location_on",
    },
    {
      label: "Preferences",
      href: "/customer/preferences",
      icon: "settings",
    },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, etc).");
      return;
    }

    // Validate size (e.g. 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setUploading(true);
    try {
        const storage = getStorage();
        // Path: users/{uid}/profile_pic.{ext}
        const ext = file.name.split('.').pop();
        const storageRef = ref(storage, `users/${user.uid}/profile_pic.${ext}`);
        
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update Firebase Auth Profile
        await updateProfile(user, { photoURL: downloadURL });
        
        // Also update our global context
        await refreshUser();

        // Optional: Call your API if you store photoURL in your DB (Postgres/Neon)
        // await fetch('/api/users', { ... }); 

    } catch (error) {
        console.error("Failed to upload profile picture:", error);
        alert("Failed to upload image. Please try again.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="bg-white dark:bg-[#1a2634] rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center shadow-sm">
        
        <div 
          className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer"
          onClick={handleImageClick}
        >
          {uploading ? (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
             </div>
          ) : (
             <img
               alt={user?.displayName || "Profile"}
               className="rounded-full w-full h-full object-cover ring-4 ring-white dark:ring-[#1a2634] shadow-md transition-opacity group-hover:opacity-90"
               src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuBR5Dq5jAnsVhdOmOTS5idrOqimreHYRRcDEjIsQ-Djs-_J2wkDr5VFL_XiOG1cMnBw8ZgzQZrzSqKTxkdZPAn_Dkad8xGSCJZUa-I1A1bCWScR6FBDuoTCrBdb0kqPwn3ruNG8Wz0GE-9aVgLmkDnzV4DBjUchSbCvUp5jrHPFe2-DcuYn10CBOtQxF270FSBBITv2tQ53RQ92WeoIxdGUCj7u2wUQAbncpr52cmHARM1ALpOpZlUWnl5_5tKbudzknAzYXJl76K84"}
             />
          )}

          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <span className="material-symbols-outlined">photo_camera</span>
          </div>
          
          {/* Hidden File Input */}
          <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
          />
        </div>

        <h2 className="font-bold text-lg dark:text-white">
          {user?.displayName || "Guest User"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {user?.email || "No email"}
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          Gold Member
        </div>
      </div>

      <nav className="bg-white dark:bg-[#1a2634] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-600/20 text-[#136dec] dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>{" "}
                {item.label}
              </Link>
            );
          })}
          
          <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">logout</span> Log Out
          </button>
        </div>
      </nav>
    </div>
  );
}
