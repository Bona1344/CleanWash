import React, { useState } from 'react';

interface ReviewSubmitStepProps {
  formData: any;
  services: any;
  basePricing: any;
  preferences: any;
  selectedGarments: string[];
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  onEditStep: (step: number) => void;
}

const GARMENT_LABELS: any = {
  tshirt: 'T-Shirt / Polo',
  trousers: 'Trousers / Jeans',
  suit: 'Suits (2pcs)',
  bedsheet: 'Bedsheet',
  duvet: 'Duvet',
  pillow: 'Pillow Case',
  gown: 'Gown / Dress',
};

export default function ReviewSubmitStep({
  formData,
  services,
  basePricing,
  preferences,
  selectedGarments,
  onBack,
  onSubmit,
  loading,
  onEditStep
}: ReviewSubmitStepProps) {
  const [agreed, setAgreed] = useState(false);

  const getPrice = (garmentKey: string, type: 'Wash' | 'Dry' | 'Iron') => {
      const key = `${garmentKey}${type}`;
      return basePricing[key];
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 px-4 pb-6">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Review Registration</h1>
          <p className="text-[#617289] dark:text-gray-400 text-base font-normal leading-normal">Please review your details below before submitting your shop for approval.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-8">
        <div className="flex gap-6 justify-between items-end">
          <p className="text-[#111418] dark:text-white text-base font-medium leading-normal">Step 3 of 3: Review & Submit</p>
          <span className="text-sm text-[#617289] dark:text-gray-400">100% Completed</span>
        </div>
        <div className="rounded-full bg-[#dbe0e6] dark:bg-gray-700 overflow-hidden h-2">
          <div className="h-full rounded-full bg-[#136dec]" style={{ width: "100%" }}></div>
        </div>
      </div>

      <div className="mx-4 mb-10 rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 md:p-10">
        
        {/* Shop Information */}
        <div className="mb-10">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#136dec]">storefront</span>
              <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Shop Information</h2>
            </div>
            <button onClick={() => onEditStep(1)} className="text-[#136dec] font-medium hover:underline text-sm">Edit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex gap-4 items-start">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 border border-gray-200 dark:border-gray-700 shrink-0" style={{backgroundImage: 'url("https://via.placeholder.com/64")'}}></div>
              <div>
                <p className="text-sm text-[#617289] dark:text-gray-400 font-medium">Shop Logo</p>
                <p className="text-[#111418] dark:text-white text-base font-medium">Uploaded</p>
              </div>
            </div>
            <div className="md:col-span-1"></div>
            <div>
              <p className="text-sm text-[#617289] dark:text-gray-400 font-medium mb-1">Shop Name</p>
              <p className="text-[#111418] dark:text-white text-base">{formData.shopName}</p>
            </div>
            <div>
              <p className="text-sm text-[#617289] dark:text-gray-400 font-medium mb-1">Owner Name</p>
              <p className="text-[#111418] dark:text-white text-base">{formData.ownerName}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-[#617289] dark:text-gray-400 font-medium mb-1">Description</p>
              <p className="text-[#111418] dark:text-white text-base">{formData.description || "No description provided."}</p>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="mb-10">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#136dec]">location_on</span>
              <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Contact & Location</h2>
            </div>
            <button onClick={() => onEditStep(1)} className="text-[#136dec] font-medium hover:underline text-sm">Edit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-sm text-[#617289] dark:text-gray-400 font-medium mb-1">Email Address</p>
              <p className="text-[#111418] dark:text-white text-base">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-[#617289] dark:text-gray-400 font-medium mb-1">Phone Number</p>
              <p className="text-[#111418] dark:text-white text-base">{formData.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-[#617289] dark:text-gray-400 font-medium mb-1">Address</p>
              <p className="text-[#111418] dark:text-white text-base">
                {formData.streetAddress}, {formData.city}, {formData.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Services & Pricing */}
        <div className="mb-10">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#136dec]">sell</span>
              <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Services & Pricing</h2>
            </div>
            <button onClick={() => onEditStep(2)} className="text-[#136dec] font-medium hover:underline text-sm">Edit</button>
          </div>
          <div className="border rounded-lg overflow-hidden border-[#dbe0e6] dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-light dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold text-[#111418] dark:text-white">Service Name</th>
                  <th className="px-4 py-3 font-semibold text-[#111418] dark:text-white">Category</th>
                  <th className="px-4 py-3 font-semibold text-[#111418] dark:text-white text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbe0e6] dark:divide-gray-700 bg-white dark:bg-gray-800">
                {/* Dynamically render rows based on selected garments and services */}
                {selectedGarments.map((key) => {
                    const label = GARMENT_LABELS[key] || key;
                    const washPrice = getPrice(key, 'Wash');
                    const dryPrice = getPrice(key, 'Dry');
                    const ironPrice = getPrice(key, 'Iron');

                    return (
                        <React.Fragment key={key}>
                            {services.washFold && washPrice !== undefined && (
                                <tr>
                                    <td className="px-4 py-3 text-[#111418] dark:text-white">{label} Wash</td>
                                    <td className="px-4 py-3 text-[#617289] dark:text-gray-400">Wash & Fold</td>
                                    <td className="px-4 py-3 text-[#111418] dark:text-white text-right">₦{Number(washPrice).toFixed(2)}</td>
                                </tr>
                            )}
                            {services.dryClean && dryPrice !== undefined && (
                                <tr>
                                     <td className="px-4 py-3 text-[#111418] dark:text-white">{label} Dry Clean</td>
                                     <td className="px-4 py-3 text-[#617289] dark:text-gray-400">Dry Cleaning</td>
                                     <td className="px-4 py-3 text-[#111418] dark:text-white text-right">₦{Number(dryPrice).toFixed(2)}</td>
                                </tr>
                            )}
                             {services.ironing && ironPrice !== undefined && (
                                <tr>
                                     <td className="px-4 py-3 text-[#111418] dark:text-white">{label} Ironing</td>
                                     <td className="px-4 py-3 text-[#617289] dark:text-gray-400">Ironing Only</td>
                                     <td className="px-4 py-3 text-[#111418] dark:text-white text-right">₦{Number(ironPrice).toFixed(2)}</td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4 pt-4 border-t border-[#f0f2f4] dark:border-gray-700">
          <label className="flex items-start gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-background-light dark:hover:bg-gray-900 transition-colors">
            <div className="relative flex items-center mt-0.5">
              <input 
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 shadow-sm transition-all checked:border-[#136dec] checked:bg-[#136dec] hover:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20" 
                id="terms" type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white pointer-events-none">
                <svg className="h-3.5 w-3.5" fill="currentColor" stroke="currentColor" strokeWidth="1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                </svg>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#111418] dark:text-white font-medium">I accept the Terms and Conditions</span>
              <span className="text-sm text-[#617289] dark:text-gray-400">By checking this box, I confirm that the information provided is accurate and I agree to the <a className="text-[#136dec] hover:underline" href="#">Terms of Service</a> and <a className="text-[#136dec] hover:underline" href="#">Privacy Policy</a>.</span>
            </div>
          </label>
        </div>

      </div>

      <div className="sticky bottom-0 z-10 flex justify-between items-center px-6 py-6 border-t border-[#f0f2f4] dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-t-xl mx-4 shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-transparent text-[#617289] dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Back
        </button>
        <div className="flex gap-4">
          <button className="hidden sm:flex items-center justify-center h-12 px-6 rounded-full bg-[#f0f2f4] dark:bg-gray-700 text-[#111418] dark:text-white font-bold hover:bg-[#e1e3e5] dark:hover:bg-gray-600 transition-colors">
            Save Draft
          </button>
          <button 
            onClick={onSubmit}
            disabled={loading || !agreed}
            className="flex items-center justify-center h-12 px-8 rounded-full bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Registering..." : "Complete Registration"}
            <span className="material-symbols-outlined text-xl ml-2">check_circle</span>
          </button>
        </div>
      </div>
    </>
  );
}
