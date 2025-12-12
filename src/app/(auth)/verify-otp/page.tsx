"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get data from URL params (passed from signup page)
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";
  const password = searchParams.get("password") || "";
  const role = searchParams.get("role") as "customer" | "shop_owner" || "customer";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email || !password) {
      router.push("/signup");
    }
  }, [email, password, router]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if 6 digits pasted
    if (pastedData.length === 6) {
      handleVerifyOTP(pastedData);
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Verify OTP with backend
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData.error || "Invalid OTP code");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      // OTP verified! Now create Firebase account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // Sync with PostgreSQL
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

      // Redirect based on role
      if (role === "shop_owner") {
        router.push("/shop/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Failed to verify OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend OTP");
        return;
      }

      setResendCooldown(60); // 60 second cooldown
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const isCustomer = role === "customer";
  const themeColor = isCustomer ? "#003d29" : "#1a1a1a";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 text-gray-800">
        <button
          onClick={() => router.push("/signup")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to signup
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Verify Your Email</h1>
          <p className="text-gray-500">
            We've sent a 6-digit code to
            <br />
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter verification code
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-white/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                disabled={isVerifying}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => handleVerifyOTP()}
          disabled={isVerifying || otp.some((digit) => digit === "")}
          className="w-full text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            backgroundColor: themeColor,
            opacity: isVerifying || otp.some((digit) => digit === "") ? 0.5 : 1,
          }}
        >
          {isVerifying ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Verify & Continue"
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={isResending || resendCooldown > 0}
            className="text-sm font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ color: resendCooldown > 0 ? "#999" : themeColor }}
          >
            {isResending ? (
              "Sending..."
            ) : resendCooldown > 0 ? (
              `Resend code in ${resendCooldown}s`
            ) : (
              "Resend code"
            )}
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            💡 <strong>Tip:</strong> Check your spam folder if you don't see the email.
            The code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
