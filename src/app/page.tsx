import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
        
        {/* Hero Badge */}
        <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-600">Premium Laundry Service</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          CleanMatch
        </h1>

        {/* Hero Description */}
        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Experience the future of laundry. 
          <br className="hidden md:block" />
          Connect with top-rated local shops for premium care.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link 
                href="/login"
                className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
                <span className="flex items-center gap-2">
                    Get Started <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
            </Link>
            
            <Link 
                href="/login" // Or Learn More section
                className="px-8 py-4 bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 rounded-2xl font-bold text-lg hover:bg-white/80 transition-all w-full sm:w-auto"
            >
                Start Shop
            </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {[
                { icon: Clock, title: "Fast Turnaround", desc: "Get your clothes back in 24h." },
                { icon: ShieldCheck, title: "Adding Trust", desc: "Verified shops only." },
                { icon: Sparkles, title: "Premium Quality", desc: "Best-in-class cleaning." }
            ].map((feature, i) => (
                <div key={i} className="glass-card p-6 rounded-3xl flex flex-col items-center">
                    <div className="p-3 bg-blue-50 rounded-2xl mb-4 text-blue-600">
                        <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
            ))}
        </div>

      </main>

      <footer className="absolute bottom-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} CleanMatch Inc.
      </footer>
    </div>
  );
}
