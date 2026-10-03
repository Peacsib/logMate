"use client";

import { useState, useMemo, type FormEventHandler } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import { ProgrammeCombobox } from "@/components/academic/ProgrammeCombobox";
import { useProgrammes } from "@/hooks/useAcademicData";
import { ElegantText } from "@/components/ui/elegant-text";

export default function RegisterStudentPage() {
  const router = useRouter();
  useProgrammes(); // Load programmes data

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccessExit, setIsSuccessExit] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    regNumber: "",
    programmeId: "",
    phone: "",
  });

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const emailPrefix = useMemo(() => {
    if (!formData.email.includes("@")) return "";
    return formData.email.split("@")[0].trim().toUpperCase();
  }, [formData.email]);

  const isRegNumberMatching = useMemo(() => {
    if (!emailPrefix || !formData.regNumber) return true;
    return formData.regNumber.trim().toUpperCase() === emailPrefix;
  }, [emailPrefix, formData.regNumber]);

  const handleNext = () => {
    if (!formData.fullName.trim()) { toast.error("Please enter your full name."); return; }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter your valid university email (e.g. R2421428@uofzmail.uz.ac.zw).");
      return;
    }
    if (formData.password.length < 6) { toast.error("Password must be at least 6 characters long."); return; }
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match."); return; }
    const prefix = formData.email.split("@")[0].trim().toUpperCase();
    if (prefix && (!formData.regNumber || formData.regNumber === "")) {
      setFormData((prev) => ({ ...prev, regNumber: prefix }));
    }
    setStep(2);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const cleanReg = formData.regNumber.trim().toUpperCase();
    const cleanPrefix = emailPrefix.trim().toUpperCase();
    if (!cleanReg) { toast.error("Registration number is required (e.g. R2421428)."); return; }
    if (cleanPrefix && cleanReg !== cleanPrefix) {
      toast.error(`Registration number (${cleanReg}) must match your email prefix (${cleanPrefix}). Student emails are formatted as <regNumber>@uofzmail.uz.ac.zw.`);
      return;
    }
    if (!formData.programmeId) { toast.error("Please select your degree programme."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          regNumber: cleanReg,
          programmeId: Number(formData.programmeId),
          phone: formData.phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account.");

      const registeredEmail = formData.email.trim().toLowerCase();
      setIsSuccessExit(true);
      toast.success("Account created successfully! Preparing sign-in...", { duration: 3000 });
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(registeredEmail)}&registered=true&cube=1`);
      }, 480);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 relative bg-cover bg-center"
      style={{ backgroundImage: "url(/register-student1.webp)" }}
    >
      {/* Lighter overlay - easier to see background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 15, 40, 0.70) 0%, rgba(0, 33, 71, 0.60) 40%, rgba(15, 52, 96, 0.50) 100%)',
        }}
      />
      {/* Subtle vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at top left, transparent 0%, rgba(0, 0, 0, 0.10) 100%)',
        }}
      />

      <div
        className="w-full max-w-md relative z-10"
        style={{ perspective: "1400px", perspectiveOrigin: "center center" }}
      >
        {/* Back Link - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-white/85 hover:text-white font-light transition-all gap-2 hover:gap-3 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </motion.div>

        {/* Card - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            isSuccessExit
              ? {
                  rotateY: -82,
                  transformOrigin: "right center",
                  scale: 0.93,
                  opacity: 0.8,
                  transition: {
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
                  },
                }
              : { opacity: 1, y: 0, rotateY: 0, scale: 1 }
          }
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          className="bg-white/98 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,15,40,0.4)] border border-white/80 relative"
        >
          {isSuccessExit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black pointer-events-none rounded-2xl z-40"
            />
          )}
          {/* Header - Enhanced */}
          <div className="px-8 pt-8 pb-5 text-center border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#003366] to-[#002147] mb-3 shadow-lg shadow-blue-900/30">
              <GraduationCap className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-light text-gray-900 tracking-tight mb-2">
              Student <ElegantText size="lg">Registration</ElegantText>
            </h1>
            <p className="text-xs text-gray-500 font-light">
              Step {step} of 2 · {step === 1 ? "Account Basics" : "Academic Degree"}
            </p>

            {/* Step Progress Pill Indicator - Enhanced */}
            <div className="flex items-center justify-center gap-2.5 mt-4">
              <motion.div 
                animate={{ 
                  width: step === 1 ? 48 : 24,
                  backgroundColor: step === 1 ? "#003366" : "#10b981"
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full shadow-sm"
              />
              <motion.div 
                animate={{ 
                  width: step === 2 ? 48 : 24,
                  backgroundColor: step === 2 ? "#ff8c00" : "#e5e7eb"
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full shadow-sm"
              />
            </div>
          </div>

          {/* Form Body - Enhanced */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <Label className="text-sm font-bold text-gray-800 tracking-wide">Full Name</Label>
                    <Input
                      placeholder="e.g. Tendai Moyo"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="mt-2 h-9 sm:h-10 2xl:h-12 px-4 text-sm bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20 rounded-xl transition-all"
                      autoFocus
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-gray-800 tracking-wide">University Student Email</Label>
                    <Input
                      type="email"
                      placeholder="e.g. R2421428@uofzmail.uz.ac.zw"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="mt-2 h-9 sm:h-10 2xl:h-12 px-4 text-sm bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20 rounded-xl transition-all"
                    />
                    <p className="text-xs text-gray-600 font-medium mt-2 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff8c00]" />
                      <span>Format: <strong className="text-gray-800 font-semibold">&lt;regNumber&gt;@uofzmail.uz.ac.zw</strong></span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-bold text-gray-800 tracking-wide">Password</Label>
                      <div className="relative mt-2">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 chars"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          className="h-9 sm:h-10 2xl:h-12 px-4 pr-12 text-sm bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20 rounded-xl transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-800 tracking-wide">Confirm</Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-type"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        className="mt-2 h-9 sm:h-10 2xl:h-12 px-4 text-sm bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full h-10 sm:h-11 2xl:h-12 mt-3 bg-gradient-to-r from-[#003366] to-[#002147] hover:from-[#002147] hover:to-[#001a33] text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/20 hover:shadow-xl active:scale-[0.98] transition-all group"
                  >
                    Continue to Academic Info
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-bold text-gray-800 tracking-wide">Registration Number</Label>
                      {emailPrefix && (
                        <span className="text-xs text-gray-600 font-medium">
                          Email Prefix: <strong className="text-[#003366] font-bold">{emailPrefix}</strong>
                        </span>
                      )}
                    </div>
                    <Input
                      placeholder="e.g. R2421428"
                      value={formData.regNumber}
                      onChange={(e) => handleChange("regNumber", e.target.value)}
                      className={`h-9 sm:h-10 2xl:h-12 px-4 text-sm font-mono uppercase font-bold tracking-wide rounded-xl transition-all ${!isRegNumberMatching ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50" : "bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20"}`}
                      autoFocus
                    />
                    {!isRegNumberMatching && (
                      <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span className="font-medium">
                          <strong className="font-bold">Registration number mismatch!</strong> Your email prefix is <strong>{emailPrefix}</strong>, so your registration number must be <strong>{emailPrefix}</strong>.
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-gray-800 tracking-wide mb-2 block">Degree Programme</Label>
                    <ProgrammeCombobox
                      value={formData.programmeId}
                      onValueChange={(val) => handleChange("programmeId", val)}
                      placeholder="Search or select your degree programme..."
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-gray-800 tracking-wide">
                      Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      placeholder="+263 77 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="mt-2 h-9 sm:h-10 2xl:h-12 px-4 text-sm bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20 rounded-xl transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="h-10 sm:h-11 2xl:h-12 px-6 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !isRegNumberMatching}
                      className="flex-1 h-10 sm:h-11 2xl:h-12 bg-gradient-to-r from-[#ff8c00] to-[#ffa726] hover:from-[#e67e00] hover:to-[#ff8c00] text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 group"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer - Enhanced */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-xs text-white/80 font-light mt-6"
        >
          Already registered?{" "}
          <Link href="/login" className="text-[#ffa726] font-semibold hover:text-[#ff8c00] transition-colors">
            Sign In here
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
