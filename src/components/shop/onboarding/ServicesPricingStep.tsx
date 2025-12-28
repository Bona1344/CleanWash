import React, { useState } from 'react';

interface ServicesPricingStepProps {
  services: any;
  setServices: (services: any) => void;
  basePricing: any;
  setBasePricing: (pricing: any) => void;
  preferences: any;
  setPreferences: (prefs: any) => void;
  selectedGarments: string[];
  setSelectedGarments: (garments: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const GARMENT_CONFIG: any = {
  tshirt: { label: 'T-Shirt / Polo', desc: 'Basic tops', icon: 'styler' },
  trousers: { label: 'Trousers / Jeans', desc: 'Bottoms & Pants', icon: 'steps' },
  suit: { label: 'Suits (2pcs)', desc: 'Formal wear', icon: 'person_check', disableWash: true },
  bedsheet: { label: 'Bedsheet', desc: 'Bedding', icon: 'bed' },
  duvet: { label: 'Duvet', desc: 'Bedding', icon: 'single_bed' },
  pillow: { label: 'Pillow Case', desc: 'Bedding', icon: 'bed' }, // Using 'bed' as generic bedding icon
  gown: { label: 'Gown / Dress', desc: 'Formal/Casual', icon: 'woman' },
};

export default function ServicesPricingStep({
  services,
  setServices,
  basePricing,
  setBasePricing,
  preferences,
  setPreferences,
  selectedGarments,
  setSelectedGarments,
  onBack,
  onNext
}: ServicesPricingStepProps) {

  const [showAddMenu, setShowAddMenu] = useState(false);

  const toggleService = (key: string) => {
    setServices({ ...services, [key]: !services[key] });
  };

  const updatePrice = (garmentKey: string, type: 'Wash' | 'Dry' | 'Iron', value: string) => {
    // Construct key like 'tshirtWash' or 'bedsheetDry'
    const key = `${garmentKey}${type}`;
    setBasePricing({ ...basePricing, [key]: parseFloat(value) || 0 });
  };

  const getPrice = (garmentKey: string, type: 'Wash' | 'Dry' | 'Iron') => {
      const key = `${garmentKey}${type}`;
      return basePricing[key] || '';
  };

  const togglePreference = (key: string) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const addGarment = (key: string) => {
    if (!selectedGarments.includes(key)) {
      setSelectedGarments([...selectedGarments, key]);
    }
    setShowAddMenu(false);
  };

  const removeGarment = (key: string) => {
    setSelectedGarments(selectedGarments.filter(k => k !== key));
  }

  // Filter out already selected garments for the add menu
  const availableGarments = Object.keys(GARMENT_CONFIG).filter(key => !selectedGarments.includes(key));

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 px-4 pb-6">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Setup Shop Services</h1>
          <p className="text-[#617289] dark:text-gray-400 text-base font-normal leading-normal">Select the services you offer and set base prices for common items.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-8">
        <div className="flex gap-6 justify-between items-end">
          <p className="text-[#111418] dark:text-white text-base font-medium leading-normal">Step 2 of 3: Services & Pricing</p>
          <span className="text-sm text-[#617289] dark:text-gray-400">66% Completed</span>
        </div>
        <div className="rounded-full bg-[#dbe0e6] dark:bg-gray-700 overflow-hidden h-2">
          <div className="h-full rounded-full bg-[#136dec]" style={{ width: "66%" }}></div>
        </div>
      </div>

      <div className="mx-4 mb-10 rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 md:p-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
            <span className="material-symbols-outlined text-[#136dec]">local_laundry_service</span>
            <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Service Types</h2>
          </div>
          <p className="text-[#617289] dark:text-gray-400 text-sm mb-6">Select the primary services your laundry shop provides. You can configure detailed pricing later.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'washFold', icon: 'wash', label: 'Wash & Fold', desc: 'Regular laundry service charged by weight.' },
              { key: 'dryClean', icon: 'dry_cleaning', label: 'Dry Cleaning', desc: 'Specialized cleaning for delicate garments.' },
              { key: 'ironing', icon: 'iron', label: 'Ironing Only', desc: 'Pressing and steaming services per item.' },
              { key: 'shoeClean', icon: 'checkroom', label: 'Shoe Cleaning', desc: 'Deep cleaning and restoration for footwear.' },
              { key: 'pickup', icon: 'local_shipping', label: 'Pickup & Delivery', desc: 'Door-to-door service options.' },
            ].map((service) => (
              <label 
                key={service.key} 
                className={`cursor-pointer relative flex flex-col p-4 rounded-xl border-2 transition-all ${services[service.key] ? 'border-[#136dec] bg-blue-50 dark:bg-blue-900/20' : 'border-[#dbe0e6] dark:border-gray-600 hover:border-[#136dec]/50 bg-background-light dark:bg-gray-900/50'}`}
              >
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                  checked={services[service.key]}
                  onChange={() => toggleService(service.key)}
                />
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-[#136dec]">{service.icon}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${services[service.key] ? 'bg-[#136dec] border-[#136dec]' : 'border-[#dbe0e6]'}`}>
                    <span className={`material-symbols-outlined text-white text-sm font-bold ${services[service.key] ? 'opacity-100' : 'opacity-0'}`}>check</span>
                  </div>
                </div>
                <h3 className="text-[#111418] dark:text-white font-bold text-lg mb-1">{service.label}</h3>
                <p className="text-sm text-[#617289] dark:text-gray-400">{service.desc}</p>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
            <span className="material-symbols-outlined text-[#136dec]">sell</span>
            <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Base Pricing</h2>
          </div>
          <p className="text-[#617289] dark:text-gray-400 text-sm mb-6">Set your starting prices (in Naira) for popular items. You can add more specific items and variations here.</p>
          
          <div className="flex flex-col gap-4">
             <div className="hidden md:flex gap-4 px-4 py-2 bg-background-light dark:bg-gray-900/50 rounded-lg text-sm font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wider">
              <div className="flex-1">Garment Type</div>
              <div className="w-32">Wash & Fold</div>
              <div className="w-32">Dry Cleaning</div>
              <div className="w-32">Ironing</div>
            </div>

            {selectedGarments.map((key) => {
              const config = GARMENT_CONFIG[key] || { label: key, desc: 'Custom Item', icon: 'styler' };
              // Generate vibrant colors for icons based on key hash or just rotate
              const colorClasses = [
                 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
                 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
                 'bg-green-100 dark:bg-green-900/30 text-green-600',
                 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
                 'bg-pink-100 dark:bg-pink-900/30 text-pink-600',
              ];
              const colorClass = colorClasses[key.length % colorClasses.length];

              return (
                <div key={key} className="relative group flex flex-col md:flex-row md:items-center gap-4 p-4 border border-[#dbe0e6] dark:border-gray-700 rounded-lg">
                  {/* Remove Button (only for custom items or all items?) Let's allow removing all except maybe t-shirt */}
                  <button 
                    onClick={() => removeGarment(key)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>

                  <div className="flex-1 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <span className="material-symbols-outlined text-xl">{config.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-[#111418] dark:text-white font-bold">{config.label}</h4>
                      <p className="text-xs text-[#617289] dark:text-gray-400">{config.desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:flex md:gap-4 w-full md:w-auto">
                    {/* Wash */}
                    <div className={`w-full md:w-32 ${config.disableWash ? 'opacity-50' : ''}`}>
                      <label className="block text-xs md:hidden mb-1 text-[#617289]">Wash & Fold</label>
                      <div className="relative">
                        {config.disableWash ? (
                           <input className="w-full pl-3 pr-3 py-2 rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-[#617289] text-center text-sm font-medium cursor-not-allowed" disabled type="text" value="N/A" />
                        ) : (
                          <>
                            <span className="absolute left-3 top-2.5 text-[#617289]">₦</span>
                            <input 
                              type="number" step="50"
                              value={getPrice(key, 'Wash')}
                              onChange={(e) => updatePrice(key, 'Wash', e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111418] dark:text-white focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] text-sm font-medium"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    {/* Dry Clean */}
                    <div className="w-full md:w-32">
                      <label className="block text-xs md:hidden mb-1 text-[#617289]">Dry Cleaning</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-[#617289]">₦</span>
                        <input 
                          type="number" step="50"
                          value={getPrice(key, 'Dry')}
                          onChange={(e) => updatePrice(key, 'Dry', e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111418] dark:text-white focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] text-sm font-medium"
                        />
                      </div>
                    </div>
                    {/* Iron */}
                    <div className="w-full md:w-32">
                      <label className="block text-xs md:hidden mb-1 text-[#617289]">Ironing</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-[#617289]">₦</span>
                         <input 
                          type="number" step="50"
                          value={getPrice(key, 'Iron')}
                          onChange={(e) => updatePrice(key, 'Iron', e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111418] dark:text-white focus:ring-2 focus:ring-[#136dec]/20 focus:border-[#136dec] text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

             <div className="relative">
                <button 
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#dbe0e6] dark:border-gray-700 rounded-lg text-[#136dec] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-[#136dec] transition-colors font-medium">
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Custom Garment
                </button>

                {showAddMenu && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-[#dbe0e6] dark:border-gray-700 z-20 p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableGarments.length > 0 ? availableGarments.map(key => (
                           <button 
                             key={key}
                             onClick={() => addGarment(key)}
                             className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                           >
                              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#136dec] flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">{GARMENT_CONFIG[key].icon}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#111418] dark:text-white">{GARMENT_CONFIG[key].label}</span>
                                <span className="text-xs text-[#617289] dark:text-gray-400">{GARMENT_CONFIG[key].desc}</span>
                              </div>
                           </button>
                        )) : (
                          <div className="col-span-2 p-4 text-center text-[#617289]">
                            All available garments added!
                          </div>
                        )}
                    </div>
                )}
             </div>

          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-[#f0f2f4] dark:border-gray-700 mb-6">
            <span className="material-symbols-outlined text-[#136dec]">tune</span>
            <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Preferences & Add-ons</h2>
          </div>
          <div className="space-y-4">
             <div className="flex items-start gap-4">
              <div className="flex items-center h-6">
                <input 
                  id="express" type="checkbox" 
                  checked={preferences.express}
                  onChange={() => togglePreference('express')}
                  className="w-5 h-5 rounded border-gray-300 text-[#136dec] focus:ring-[#136dec]" 
                />
              </div>
              <div>
                <label className="font-medium text-[#111418] dark:text-white" htmlFor="express">Enable Express Service</label>
                <p className="text-sm text-[#617289] dark:text-gray-400">Charge an extra fee for same-day or rush delivery.</p>
                {preferences.express && (
                  <div className="mt-2 block">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#111418] dark:text-white">Add</span>
                      <div className="relative w-24">
                        <span className="absolute left-3 top-2 text-[#617289]">₦</span>
                        <input className="w-full pl-8 pr-2 py-1.5 rounded-md border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" type="number" 
                          value={preferences.expressSurcharge}
                          onChange={(e) => setPreferences({...preferences, expressSurcharge: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <span className="text-sm text-[#111418] dark:text-white">surcharge for express orders.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center h-6">
                <input 
                  id="fragrance" type="checkbox" 
                  checked={preferences.fragrance}
                  onChange={() => togglePreference('fragrance')}
                  className="w-5 h-5 rounded border-gray-300 text-[#136dec] focus:ring-[#136dec]" 
                />
              </div>
               <div>
                <label className="font-medium text-[#111418] dark:text-white" htmlFor="fragrance">Allow Fragrance Selection</label>
                <p className="text-sm text-[#617289] dark:text-gray-400">Let customers choose their preferred detergent scent (e.g. Lavender, Unscented).</p>
              </div>
            </div>
          </div>
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
            onClick={onNext}
            className="flex items-center justify-center h-12 px-8 rounded-full bg-[#136dec] text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
            Continue
            <span className="material-symbols-outlined text-xl ml-2">arrow_forward</span>
          </button>
        </div>
      </div>
    </>
  );
}
