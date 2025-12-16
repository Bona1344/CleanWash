"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, User, Store } from "lucide-react";
import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";

// ... (Debugger removed)

export default function SignupPage() {
  // ... existing component logic ...
  // ... return statement without <NetworkDebugger /> ...
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "shop_owner">("customer");
  const [error, setError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  // Dynamic styles based on role
  const isCustomer = role === "customer";
  const themeBg = isCustomer ? "bg-[#003d29] hover:bg-[#002a1c]" : "bg-gray-900 hover:bg-gray-800";
  const linkColor = isCustomer ? "text-[#003d29]" : "text-gray-900";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    setError("");
    
    try {
      // 1. Create Firebase Account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // 2. Send Verification Email
      await sendEmailVerification(userCredential.user);

      // 3. Create User in Database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: name,
          role: role,
          intent: "signup",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.shouldSignIn) {
          setError(data.error);
          await auth.signOut();
          return;
        }
        throw new Error(data.error || "Failed to create account");
      }

      // 4. Redirect to Check Email page
      router.push(`/check-email?email=${encodeURIComponent(email)}&role=${role}`);
    } catch (err: any) {
      console.error("Signup error:", err);
      // Improved Error Logging for User
      let errorMsg = err.message || "Failed to sign up.";
      if (err.code === "auth/network-request-failed") {
        errorMsg = "Network Error: Firebase could not be reached. Please check your internet connection or try the Network Debugger below.";
      }
      setError(errorMsg);
      
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Please sign in instead.");
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithGoogle();
      
      // Sync user to database with selected role
      if (userCredential?.user) {
        console.log("🔵 User signed up with Google:", userCredential.user.email);
        console.log("🔵 Selected role:", role);
        
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || "User",
              role: role, 
              intent: "signup" // Flag to check for existence
            }),
          });

          const data = await response.json();
          console.log("🔵 API Response:", data);

          if (!response.ok) {
            // Handle duplicate account with different role OR same role
            if (response.status === 409 && data.shouldSignIn) {
              setError(data.error);
              // Optionally sign out the user since they shouldn't proceed
              await auth.signOut();
              return;
            }
            throw new Error(data.error || "Failed to create account");
          }
          
          console.log("✅ User created/synced successfully with role:", data.role);
          
          // Redirect based on role and shop existence
          if (role === "shop_owner") {
            if (data.hasShop) {
                console.log("🏪 Shop already exists. Redirecting to dashboard...");
                router.push("/dashboard");
            } else {
                console.log("🏪 New shop owner. Redirecting to onboarding...");
                router.push("/shop/onboarding");
            }
          } else {
            console.log("🛒 Redirecting to customer dashboard...");
            router.push("/dashboard");
          }
          return; // Exit early
        } catch (dbError: any) {
          console.error("❌ Failed to sync user to DB:", dbError);
          setError(dbError.message || "Failed to create account");
          return;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign up with Google.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 text-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h1>
          <p className="text-gray-500">Join CleanMatch today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === "customer"
                  ? "bg-[#003d29] border-[#003d29] text-white shadow-lg"
                  : "bg-white/50 border-gray-200 text-gray-500 hover:bg-white/80"
              }`}
            >
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("shop_owner")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === "shop_owner"
                  ? "bg-gray-900 border-gray-800 text-white shadow-lg"
                  : "bg-white/50 border-gray-200 text-gray-500 hover:bg-white/80"
              }`}
            >
              <Store className="h-6 w-6" />
              <span className="text-sm font-medium">Shop Owner</span>
            </button>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className={`w-full ${themeBg} text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6`}
          >
            {isSigningUp ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <div className="h-px bg-gray-200 w-full"></div>
          <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
          <div className="h-px bg-gray-200 w-full"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="mt-8 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className={`${linkColor} font-bold hover:underline`}>
            Sign In
          </Link>
        </p>

        <NetworkDebugger />
      </div>
    </div>
  );
}
