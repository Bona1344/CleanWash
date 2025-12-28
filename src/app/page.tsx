import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-b-[#2a3646] bg-white dark:bg-[#101822] px-10 py-3">
        <div className="flex items-center gap-4">
          <div className="size-8 text-[#136dec]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">Ryns</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="/shop/onboarding">
              For Shop Owners
            </Link>
            <Link className="text-sm font-medium leading-normal hover:text-[#136dec] transition-colors dark:text-gray-300 dark:hover:text-white" href="/login">
              Log In
            </Link>
          </div>
          <Link href="/signup" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#136dec] hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Sign Up</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full">
        <div className="absolute inset-0 z-0">
          <div 
            className="h-full w-full bg-cover bg-center" 
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1600&q=80")'
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 lg:py-32">
          <div className="max-w-4xl text-center space-y-6 mb-10">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl drop-shadow-lg">
              Fresh Clothes, Delivered to Your Doorstep.
            </h1>
            <h2 className="text-white text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
              Find top-rated laundry shops for washing, drying, and ironing near you. We handle the dirty work so you don't have to.
            </h2>
          </div>

          {/* Search Form */}
          <div className="w-full max-w-5xl bg-white dark:bg-[#1a2634] rounded-xl shadow-xl p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">What needs cleaning?</label>
                <div className="relative flex items-center h-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#101822] group focus-within:border-[#136dec] focus-within:ring-1 focus-within:ring-[#136dec] transition-all">
                  <span className="material-symbols-outlined text-gray-400 pl-3">checkroom</span>
                  <input className="w-full bg-transparent border-none text-sm md:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 px-3" placeholder="e.g. Suits, Curtains, Silk Shirt"/>
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Service Type</label>
                <div className="relative flex items-center h-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#101822] group focus-within:border-[#136dec] focus-within:ring-1 focus-within:ring-[#136dec] transition-all">
                  <span className="material-symbols-outlined text-gray-400 pl-3">local_laundry_service</span>
                  <select className="w-full bg-transparent border-none text-sm md:text-base text-gray-900 dark:text-white focus:ring-0 px-3 appearance-none cursor-pointer">
                    <option>Wash & Fold</option>
                    <option>Dry Clean Only</option>
                    <option>Ironing</option>
                    <option>Household Items</option>
                  </select>
                  <span className="material-symbols-outlined text-gray-400 absolute right-3 pointer-events-none text-sm">expand_more</span>
                </div>
              </div>
              <div className="flex-[1.5] min-w-[240px]">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Location</label>
                <div className="relative flex items-center h-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#101822] group focus-within:border-[#136dec] focus-within:ring-1 focus-within:ring-[#136dec] transition-all">
                  <span className="material-symbols-outlined text-gray-400 pl-3">location_on</span>
                  <input className="w-full bg-transparent border-none text-sm md:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 px-3" placeholder="Enter Zip Code or Neighborhood"/>
                  <button className="mr-2 p-1.5 text-[#136dec] hover:bg-[#136dec]/10 rounded-full transition-colors" title="Use my location">
                    <span className="material-symbols-outlined text-[20px]">my_location</span>
                  </button>
                </div>
              </div>
              <div className="flex items-end lg:w-auto w-full">
                <Link href="/dashboard" className="h-12 w-full lg:w-auto px-8 bg-[#136dec] hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">search</span>
                  <span>Find Laundry</span>
                </Link>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-2">Quick Select:</span>
              <button className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-medium transition-colors border border-transparent hover:border-gray-300 dark:border-gray-600">Daily Wash</button>
              <button className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-medium transition-colors border border-transparent hover:border-gray-300 dark:border-gray-600">Delicates</button>
              <button className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-medium transition-colors border border-transparent hover:border-gray-300 dark:border-gray-600">Bedding</button>
              <button className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-medium transition-colors border border-transparent hover:border-gray-300 dark:border-gray-600">Express (24h)</button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Services */}
      <div className="px-4 py-16 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Popular Services</h2>
              <p className="text-gray-500 dark:text-gray-400">Choose from our most requested laundry solutions.</p>
            </div>
            <Link className="hidden sm:flex items-center text-[#136dec] font-semibold text-sm hover:underline" href="/dashboard">
              View All Services
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Wash & Fold", desc: "Everyday clothes, towels & sheets washed, dried and folded.", img: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80" },
              { title: "Dry Cleaning", desc: "Expert care for suits, dresses, and delicate fabrics.", img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80" },
              { title: "Ironing Only", desc: "Crisp, wrinkle-free pressing for your freshly washed clothes.", img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&q=80" },
              { title: "Shoe Cleaning", desc: "Deep cleaning and restoration for sneakers and leather shoes.", img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80" }
            ].map((service, i) => (
              <div key={i} className="group bg-white dark:bg-[#1a2634] rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="h-40 bg-gray-200 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${service.img}")` }}></div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-[#101822] py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#136dec] font-bold text-sm tracking-widest uppercase mb-2 block">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 dark:bg-gray-800 -z-0"></div>
            {[
              { icon: "app_registration", title: "1. Book Online", desc: "Select your services, choose a pickup time, and enter your location easily." },
              { icon: "local_shipping", title: "2. We Collect", desc: "Our partners pick up your laundry bags from your doorstep at the scheduled time." },
              { icon: "check_circle", title: "3. We Deliver", desc: "Get fresh, clean, and folded clothes delivered back to you in as little as 24 hours." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-[#136dec]">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-[#136dec]/5 dark:bg-[#136dec]/10 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center md:text-left">
          {[
            { icon: "verified_user", title: "Trusted Partners", desc: "Vetted & top-rated shops" },
            { icon: "shield", title: "Insured Handling", desc: "Damage protection guarantee" },
            { icon: "eco", title: "Eco-Friendly", desc: "Sustainable wash options" }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#136dec] text-3xl">{badge.icon}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{badge.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#101822] border-t border-gray-100 dark:border-gray-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 text-[#111418] dark:text-white">
                <div className="size-8 text-[#136dec]">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Ryns</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Making laundry day easier for everyone. Find the best laundry shop and services near you with just a few clicks.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <Link key={social} className="text-gray-400 hover:text-[#136dec] transition-colors" href="#">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {social === "facebook" && <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>}
                      {social === "twitter" && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>}
                      {social === "instagram" && <path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.373c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fillRule="evenodd"></path>}
                      {social === "linkedin" && <path clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fillRule="evenodd"></path>}
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                {["About Us", "Careers", "Location", "Press", "Blog"].map((item) => (
                  <li key={item}><Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                {["Contact", "Help Center", "Terms", "Terms of Service", "Privacy Policy", "FAQs"].map((item) => (
                  <li key={item}><Link className="hover:text-[#136dec] transition-colors" href="#">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">location_on</span>
                  <span>Shop 24, Laundry Ave, NY 10012</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">call</span>
                  <span>+1 (555) 012-3456</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-[20px] shrink-0">mail</span>
                  <span>support@ryns.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Get The App</h4>
              <div className="flex flex-col gap-3">
                <button className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2 flex items-center gap-3 transition-colors text-left">
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.36,13.08L18.92,12.25L15.39,15.79L17.66,13.52C18.42,12.76 19.64,12.76 20.36,13.08M13.69,12L3.84,2.15L6.05,2.66L16.81,8.88C17.5,9.29 17.5,10.29 16.81,10.7L13.69,12Z"></path></svg>
                  <div>
                    <div className="text-[10px] uppercase leading-none opacity-80">Get it on</div>
                    <div className="text-sm font-bold leading-tight">Play Store</div>
                  </div>
                </button>
                <button className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2 flex items-center gap-3 transition-colors text-left">
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.04,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z"></path></svg>
                  <div>
                    <div className="text-[10px] uppercase leading-none opacity-80">Download on the</div>
                    <div className="text-sm font-bold leading-tight">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 Ryns. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
