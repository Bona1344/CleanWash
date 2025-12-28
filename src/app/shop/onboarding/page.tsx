"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ShopDetailsStep from "@/components/shop/onboarding/ShopDetailsStep";
import ServicesPricingStep from "@/components/shop/onboarding/ServicesPricingStep";
import ReviewSubmitStep from "@/components/shop/onboarding/ReviewSubmitStep";

interface BusinessHours {
  [key: string]: {
    enabled: boolean;
    open: string;
    close: string;
  };
}

export default function ShopOnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 Data
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    description: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    email: "",
    phone: "",
    website: "",
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { enabled: true, open: "09:00", close: "17:00" },
    tuesday: { enabled: true, open: "09:00", close: "17:00" },
    wednesday: { enabled: false, open: "09:00", close: "17:00" },
    thursday: { enabled: true, open: "09:00", close: "17:00" },
    friday: { enabled: true, open: "09:00", close: "17:00" },
    saturday: { enabled: true, open: "10:00", close: "15:00" },
    sunday: { enabled: false, open: "09:00", close: "17:00" },
  });

  // Step 2 Data
  const [services, setServices] = useState({
    washFold: true,
    dryClean: true,
    ironing: false,
    shoeClean: false,
    pickup: false
  });

  const [basePricing, setBasePricing] = useState({
    tshirtWash: 2.50,
    tshirtDry: 5.00,
    tshirtIron: 1.50,
    trousersWash: 3.50,
    trousersDry: 6.50,
    trousersIron: 2.00,
    suitDry: 15.00,
    suitIron: 5.00,
  });

  const [preferences, setPreferences] = useState({
    express: false,
    expressSurcharge: 5.00,
    fragrance: true,
  });

  const [selectedGarments, setSelectedGarments] = useState<string[]>(['tshirt', 'trousers', 'suit']);

  // Populate user info
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ownerName: prev.ownerName || user.displayName || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.shopName,
          description: formData.description,
          address: `${formData.streetAddress}, ${formData.city}, ${formData.zipCode}`,
          phone: formData.phone,
          email: formData.email,
          ownerId: user?.uid,
          businessHours: businessHours,
          // New fields
          services: services,
          pricing: basePricing,
          preferences: preferences
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create shop");
      }

      console.log("✅ Shop created successfully:", data);
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("❌ Error creating shop:", error);
      setError(error.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-gray-900 px-6 md:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3 text-[#111418] dark:text-white">
          <div className="size-8 text-[#136dec] flex items-center justify-center">
            <span className="material-symbols-outlined !text-[32px]">local_laundry_service</span>
          </div>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Ryns</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 dark:border-gray-700" style={{backgroundImage: `url("${user?.photoURL || 'https://via.placeholder.com/40'}")`}}></div>
        </div>
      </header>

      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-40 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            {step === 1 && (
              <ShopDetailsStep
                formData={formData}
                setFormData={setFormData}
                businessHours={businessHours}
                setBusinessHours={setBusinessHours}
                onNext={() => setStep(2)}
                error={error}
              />
            )}

            {step === 2 && (
              <ServicesPricingStep
                services={services}
                setServices={setServices}
                basePricing={basePricing}
                setBasePricing={setBasePricing}
                preferences={preferences}
                setPreferences={setPreferences}
                selectedGarments={selectedGarments}
                setSelectedGarments={setSelectedGarments}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <ReviewSubmitStep
                formData={formData}
                services={services}
                basePricing={basePricing}
                preferences={preferences}
                selectedGarments={selectedGarments}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                loading={loading}
                onEditStep={(s) => setStep(s)}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
