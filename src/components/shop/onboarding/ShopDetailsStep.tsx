import React from 'react';
import Link from "next/link";

interface BusinessHours {
  [key: string]: {
    enabled: boolean;
    open: string;
    close: string;
  };
}

interface ShopDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
  businessHours: BusinessHours;
  setBusinessHours: (hours: BusinessHours) => void;
  onNext: () => void;
  error?: string;
}

export default function ShopDetailsStep({
  formData,
  setFormData,
  businessHours,
  setBusinessHours,
  onNext,
  error
}: ShopDetailsStepProps) {

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const toggleDay = (day: string) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        enabled: !businessHours[day].enabled,
      },
    });
  };

  const updateHours = (day: string, field: "open" | "close", value: string) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [field]: value,
      },
    });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleContinue}>
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3 px-4 pb-6">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Register your Laundry Shop</h1>
            <p className="text-[#617289] dark:text-gray-400 text-base font-normal leading-normal">Fill in the details below so customers can find you easily.</p>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex flex-col gap-3 px-4 pb-8">
          <div className="flex gap-6 justify-between items-end">
            <p className="text-[#111418] dark:text-white text-base font-medium leading-normal">Step 1 of 3: Shop Details</p>
            <span className="text-sm text-[#617289] dark:text-gray-400">33% Completed</span>
          </div>
          <div className="rounded-full bg-[#dbe0e6] dark:bg-gray-700 overflow-hidden h-2">
            <div className="h-full rounded-full bg-[#136dec]" style={{width: "33%"}}></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Form Card */}
          <div className="mx-4 mb-10 rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 md:p-10">
            {/* Section 1: Basic Information */}
            <div className="mb-10">
              <div className="flex items-center gap-3 pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
                <span className="material-symbols-outlined text-[#136dec]">storefront</span>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Basic Information</h2>
              </div>

              {/* Logo Upload */}
              <div className="mb-8">
                <label className="block text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">Shop Logo</label>
                <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#dbe0e6] dark:border-gray-600 rounded-xl bg-background-light dark:bg-gray-900/50 hover:border-[#136dec] hover:bg-blue-50 dark:hover:bg-gray-900 transition-all cursor-pointer group">
                  <input type="file" className="hidden" accept="image/*" />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[#9ca3af] group-hover:text-[#136dec]">cloud_upload</span>
                    </div>
                    <p className="mb-1 text-sm text-[#617289] dark:text-gray-400">
                      <span className="font-semibold text-[#136dec]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-[#9ca3af] dark:text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <label className="flex flex-col flex-1">
                  <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">Shop Name</p>
                  <div className="relative">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                      placeholder="e.g. Sparkle Clean Laundry"
                      required
                      value={formData.shopName}
                      onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">storefront</span>
                  </div>
                </label>
                <label className="flex flex-col flex-1">
                  <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2 ">Owner Name</p>
                  <div className="relative">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                      placeholder="e.g. John Doe"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">person</span>
                  </div>
                </label>
              </div>

              <label className="flex flex-col w-full">
                <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">Description</p>
                <textarea
                  className="form-input flex w-full min-w-0 flex-1 resize-none rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-28 placeholder:text-[#617289] p-4 text-base font-normal leading-normal transition-all"
                  placeholder="Tell customers a bit about your services, special equipment, or amenities..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </label>
            </div>

            {/* Section 2: Location */}
            <div className="mb-10">
              <div className="flex items-center gap-3 pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
                <span className="material-symbols-outlined text-[#136dec]">location_on</span>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Location</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col gap-6 lg:col-span-2">
                  <label className="flex flex-col w-full">
                    <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">Street Address</p>
                    <div className="relative">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                        placeholder="123 Main St"
                        required
                        value={formData.streetAddress}
                        onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                      />
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">search</span>
                    </div>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col w-full">
                      <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">City</p>
                      <div className="relative">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                          placeholder="New York"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">location_city</span>
                      </div>
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">Zip Code</p>
                      <div className="relative">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                          placeholder="10001"
                          required
                          value={formData.zipCode}
                          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">pin_drop</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="w-full h-full min-h-[220px] rounded-lg bg-cover bg-center overflow-hidden relative border border-[#dbe0e6] dark:border-gray-600 shadow-sm" style={{backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80")'}}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-full shadow-xl text-[#136dec] animate-bounce">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Contact */}
            <div className="mb-10">
              <div className="flex items-center gap-3 pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
                <span className="material-symbols-outlined text-[#136dec]">contact_phone</span>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex flex-col flex-1">
                  <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">Email Address</p>
                  <div className="relative">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                      placeholder="contact@shop.com"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">mail</span>
                  </div>
                </label>
                <label className="flex flex-col flex-1">
                  <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">Phone Number</p>
                  <div className="relative">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                      placeholder="(555) 000-0000"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">call</span>
                  </div>
                </label>
                <label className="flex flex-col flex-1">
                  <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal pb-2">Website (Optional)</p>
                  <div className="relative">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 h-12 placeholder:text-[#617289] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                      placeholder="https://..."
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#9ca3af] text-xl">language</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 4: Business Hours */}
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
                <span className="material-symbols-outlined text-[#136dec]">schedule</span>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Business Hours</h2>
              </div>

              <div className="flex flex-col gap-3">
                {days.map((day) => (
                  <div key={day.key} className={`flex flex-wrap md:flex-nowrap items-center justify-between p-4 rounded-lg bg-background-light dark:bg-gray-900/50 border border-transparent hover:border-[#dbe0e6] dark:hover:border-gray-600 transition-colors ${!businessHours[day.key].enabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-4 min-w-[150px] mb-3 md:mb-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={businessHours[day.key].enabled}
                          onChange={() => toggleDay(day.key)}
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#136dec]"></div>
                      </label>
                      <span className="text-[#111418] dark:text-white text-base font-medium">{day.label}</span>
                    </div>
                    <div className={`flex gap-3 items-center w-full md:w-auto ${!businessHours[day.key].enabled ? 'pointer-events-none grayscale' : ''}`}>
                      <div className="relative flex-1">
                        <input
                          className="h-10 w-full md:w-32 rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] shadow-sm px-2"
                          type="time"
                          value={businessHours[day.key].open}
                          onChange={(e) => updateHours(day.key, "open", e.target.value)}
                        />
                      </div>
                      <span className="text-[#617289] font-medium">-</span>
                      <div className="relative flex-1">
                        <input
                          className="h-10 w-full md:w-32 rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] shadow-sm px-2"
                          type="time"
                          value={businessHours[day.key].close}
                          onChange={(e) => updateHours(day.key, "close", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="sticky bottom-0 z-10 flex justify-between items-center px-6 py-6 border-t border-[#f0f2f4] dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-t-xl mx-4 shadow-lg">
            <Link href="/dashboard" className="flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-transparent text-[#617289] dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined text-xl">arrow_back</span>
              Back
            </Link>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center justify-center h-12 px-8 rounded-full bg-[#136dec] text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
              >
                Continue
                <span className="material-symbols-outlined text-xl ml-2">arrow_forward</span>
              </button>
            </div>
          </div>
    </form>
  );
}
