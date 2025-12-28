"use client";

import Link from "next/link";

export default function CustomerFooter() {
  return (
    <footer className="bg-white dark:bg-[#101822] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-[#111418] dark:text-white">
              <div className="size-8 text-[#136dec]">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Rynse</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Making laundry day easier for everyone. Find the best laundry shop and services near you with just a few clicks.
            </p>
            <div className="flex gap-4">
              <Link className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#136dec] hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined text-[18px]">public</span>
              </Link>
              <Link className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#136dec] hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              </Link>
              <Link className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#136dec] hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined text-[18px]">share</span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">About Us</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Careers</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Location</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Press</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Contact</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Help Center</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Temps</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-[#136dec] transition-colors" href="#">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 text-[#136dec]">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <span className="leading-tight">88 Laundry Ave, Clean City,<br/>WC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="text-[#136dec]">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="text-[#136dec]">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <span>support@rynse.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Get The App</h4>
            <div className="flex flex-col gap-3">
              <button className="bg-gray-900 dark:bg-gray-700 text-white rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto">
                 <span className="material-symbols-outlined">android</span>
                 <div className="text-left">
                   <div className="text-[10px] uppercase leading-none opacity-80">Get it on</div>
                   <div className="text-sm font-bold leading-tight">Google Play</div>
                 </div>
              </button>
              <button className="bg-gray-900 dark:bg-gray-700 text-white rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto">
                 <span className="material-symbols-outlined">ios</span>
                 <div className="text-left">
                   <div className="text-[10px] uppercase leading-none opacity-80">Download on the</div>
                   <div className="text-sm font-bold leading-tight">App Store</div>
                 </div>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2024 Rynse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
