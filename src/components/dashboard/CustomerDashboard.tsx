"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Store, MapPin, User } from "lucide-react";
import ReviewModal from "@/components/ReviewModal";
import Image from "next/image";

interface CustomerDashboardProps {
  user: any;
}

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [reviewModal, setReviewModal] = useState({ show: false, shopId: "", shopName: "" });

  useEffect(() => {
    fetchShops();
    fetchCustomerOrders();
  }, [user]);

  const fetchCustomerOrders = async () => {
      try {
          const res = await fetch(`/api/orders?customerId=${user?.uid}`); 
          const data = await res.json();
          if (Array.isArray(data)) setCustomerOrders(data);
      } catch (e) {
          console.error("Failed to fetch customer orders", e);
      }
  };

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops");
      const data = await res.json();
      if (Array.isArray(data)) setShops(data);
    } catch (e) {
      console.error("Failed to fetch shops", e);
    }
  };

  return (
    <div className="font-sans text-[#231f20]">
      {/* 1. Top Bar */}
      <div className="bg-[#003d29] text-white px-8 py-2 flex justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-4">
            <span>📞 +234 800 123 4567</span>
            <span className="opacity-50">|</span>
            <span>Get 50% Off on First Order</span>
        </div>
        <div className="flex items-center gap-4">
            <span>Lagos, NG</span>
            <span className="opacity-50">|</span>
            <span className="cursor-pointer hover:underline">English</span>
        </div>
      </div>

      {/* 2. Navbar */}
      <nav className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center gap-12">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
                <div className="h-8 w-8 bg-[#003d29] rounded-full flex items-center justify-center text-white font-bold">C</div>
                <span className="text-2xl font-extrabold text-[#003d29] tracking-tight">CleanMatch</span>
              </div>
              
              <div className="hidden md:flex items-center gap-8 font-semibold text-[#231f20]">
                  <a href="#" className="hover:text-[#003d29]">Categories</a>
                  <a href="#" className="hover:text-[#003d29]">Deals</a>
                  <a href="#" className="hover:text-[#003d29]">What's New</a>
                  <a href="#" className="hover:text-[#003d29]">Delivery</a>
              </div>
          </div>

          <div className="flex items-center gap-8">
              <div className="relative hidden lg:block">
                  <input 
                    type="text" 
                    placeholder="Search Laundry..." 
                    className="bg-[#f3f4f6] rounded-full px-5 py-2.5 w-64 focus:outline-none focus:ring-1 focus:ring-[#003d29] text-sm"
                  />
                  <ShoppingBag className="absolute right-4 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center gap-4 font-semibold cursor-pointer" onClick={() => router.push('/customer/profile')}>
                  <User className="h-5 w-5" />
                  <span>Account</span>
              </div>
              
               <div className="flex items-center gap-4 font-semibold cursor-pointer text-red-600" onClick={logout}>
                  <span>Sign Out</span>
              </div>
          </div>
      </nav>

      {/* 3. Hero Section */}
      <div className="bg-[#fbf0e4] min-h-[500px] px-8 md:px-20 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[500px] max-w-7xl mx-auto">
            {/* Left: Text Content */}
            <div className="space-y-6 py-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-[#003d29] leading-tight">
                    Fresh Laundry <br/> Within Hours.
                </h1>
                <p className="text-lg text-[#231f20]/80 max-w-md">
                    Experience premium fabric care. We pick up, clean, and deliver your clothes spotless and fresh.
                </p>
                <button className="bg-[#003d29] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#002a1c] transition-colors shadow-lg shadow-[#003d29]/20">
                    Book Now
                </button>
            </div>
            
            {/* Right: Laundry Image */}
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
                <Image 
                    src="/laundry-hero-new.jpg"
                    alt="Fresh laundry service"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
      </div>

      {/* 4. Filters & Content */}
      <div className="px-8 md:px-20 py-16 space-y-12 bg-white">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  <button className="bg-[#f3f4f6] hover:bg-[#003d29] hover:text-white px-6 py-2 rounded-full font-semibold transition-all">All</button>
                  <button className="bg-[#f3f4f6] hover:bg-[#003d29] hover:text-white px-6 py-2 rounded-full font-semibold transition-all">Dry Clean</button>
                  <button className="bg-[#f3f4f6] hover:bg-[#003d29] hover:text-white px-6 py-2 rounded-full font-semibold transition-all">Wash & Fold</button>
                  <button className="bg-[#f3f4f6] hover:bg-[#003d29] hover:text-white px-6 py-2 rounded-full font-semibold transition-all">Ironing</button>
              </div>
              
              <button className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 font-semibold hover:border-[#003d29]">
                  Sort by <span className="text-xs">▼</span>
              </button>
          </div>

          <h2 className="text-3xl font-bold text-[#003d29]">Recommended For You</h2>

          {/* Shop Grid - Muse Product Card Style */}
          {shops.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-gray-500 text-lg">No shops found yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shops
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .map((shop) => (
                <div key={shop.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  {/* Image Area */}
                  <div className="relative aspect-square bg-[#f3f4f6] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-300">
                          <Store className="h-20 w-20" />
                      </div>
                      
                      {/* Favorite Heart Icon (top-right) */}
                      <button className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors z-10">
                          <span className="text-gray-600 text-lg">♡</span>
                      </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                      {/* Name and Price */}
                      <div className="flex justify-between items-start gap-2">
                          <h3 className="text-base font-bold text-[#231f20] line-clamp-1 flex-1">{shop.name}</h3>
                          <span className="text-base font-bold text-[#231f20] whitespace-nowrap">
                            ${(shop._count?.services || 0) * 10}<sup className="text-xs">.00</sup>
                          </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-500 line-clamp-1">{shop.description || "Premium laundry service"}</p>
                      
                      {/* Rating and Review Count */}
                      <div className="flex items-center gap-1 text-sm">
                          <div className="flex items-center text-green-600">
                              {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < Math.floor(shop.rating || 0) ? "text-green-600" : "text-gray-300"}>★</span>
                              ))}
                          </div>
                          <span className="text-gray-600 font-medium">({shop._count?.reviews || 121})</span>
                      </div>
                      
                      {/* Book Button */}
                      <button 
                        onClick={() => router.push(`/book/${shop.id}`)}
                        className="w-full bg-transparent border-2 border-[#003d29] text-[#003d29] font-bold py-2.5 rounded-full hover:bg-[#003d29] hover:text-white transition-all mt-2"
                      >
                        Book
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recently Used Section */}
          {customerOrders.length > 0 && (
            <>
              <h2 className="text-3xl font-bold text-[#003d29] mt-16">Recently Used</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Get unique shops from customer orders */}
                {Array.from(new Set(customerOrders.map(order => order.shopId)))
                  .slice(0, 4) // Show max 4 recent shops
                  .map((shopId) => {
                    const shop = shops.find(s => s.id === shopId);
                    if (!shop) return null;
                    
                    return (
                      <div key={shop.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                        {/* Image Area */}
                        <div className="relative aspect-square bg-[#f3f4f6] overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-300">
                                <Store className="h-20 w-20" />
                            </div>
                            
                            {/* "Used Before" Badge */}
                            <div className="absolute top-3 left-3 bg-[#003d29] text-white px-3 py-1 rounded-full text-xs font-bold">
                                Previously Used
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-2">
                            {/* Name and Price */}
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-base font-bold text-[#231f20] line-clamp-1 flex-1">{shop.name}</h3>
                                <span className="text-base font-bold text-[#231f20] whitespace-nowrap">
                                  ${(shop._count?.services || 0) * 10}<sup className="text-xs">.00</sup>
                                </span>
                            </div>
                            
                            {/* Description */}
                            <p className="text-sm text-gray-500 line-clamp-1">{shop.description || "Premium laundry service"}</p>
                            
                            {/* Rating and Review Count */}
                            <div className="flex items-center gap-1 text-sm">
                                <div className="flex items-center text-green-600">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(shop.rating || 0) ? "text-green-600" : "text-gray-300"}>★</span>
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">({shop._count?.reviews || 121})</span>
                            </div>
                            
                            {/* Book Again Button */}
                            <button 
                              onClick={() => router.push(`/book/${shop.id}`)}
                              className="w-full bg-transparent border-2 border-[#003d29] text-[#003d29] font-bold py-2.5 rounded-full hover:bg-[#003d29] hover:text-white transition-all mt-2"
                            >
                              Book Again
                            </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
      </div>

      {reviewModal.show && (
          <ReviewModal 
              shopId={reviewModal.shopId}
              shopName={reviewModal.shopName}
              customerId={user?.uid}
              onClose={() => setReviewModal({ show: false, shopId: "", shopName: "" })}
              onSuccess={() => fetchShops()}
          />
      )}
    </div>
  );
}
