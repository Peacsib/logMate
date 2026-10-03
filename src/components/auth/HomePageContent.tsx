"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginFormData } from "@/utils/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  GraduationCap,
  FileText,
  Users,
  TrendingUp,
  LogIn,
} from "lucide-react";

const featureCards = [
  {
    icon: GraduationCap,
    title: "Track Placements",
    desc: "Submit and manage your work details",
  },
  {
    icon: FileText,
    title: "Keep Logbooks",
    desc: "Record your activities, reflections and tasks",
  },
  {
    icon: TrendingUp,
    title: "Build Skills",
    desc: "Track and develop your professional capabilities",
  },
  {
    icon: Users,
    title: "Upload Evidence",
    desc: "Document your work with files and images",
  },
];

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();

  const isFromReg = searchParams.get("from") === "reg";
  const registeredParam = searchParams.get("registered");
  const emailParam = searchParams.get("email");
  const initialEmail = emailParam || (registeredParam && registeredParam !== "true" ? registeredParam : "");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: initialEmail || "",
      password: "",
    },
  });

  useEffect(() => {
    if (initialEmail) {
      setValue("email", initialEmail);
      if (registeredParam || isFromReg) {
        toast.success("Account ready! Please sign in.");
      }
    }
  }, [initialEmail, setValue, registeredParam, isFromReg]);

  const onLogin = async (formData: LoginFormData) => {
    const success = await login(formData.email, formData.password);
    if (success) {
      toast.success("Welcome back to LogMate!");
      router.push("/student");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col xl:flex-row relative overflow-x-hidden font-sans">
      {/* ========================================================= */}
      {/* LEFT HERO PANEL - Enhanced with Better Overlay */}
      {/* ========================================================= */}
      <div className="relative w-full xl:w-[55%] min-h-[350px] sm:min-h-[400px] xl:min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 overflow-hidden xl:border-r border-slate-900/10">
        {/* Layer 0: Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/register-student.webp')",
          }}
        />
        
        {/* Enhanced Gradient Overlay - Deeper, More Sophisticated */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 15, 40, 0.85) 0%, rgba(0, 33, 71, 0.75) 40%, rgba(15, 52, 96, 0.65) 100%)',
          }}
        />
        
        {/* Subtle Vignette Effect */}
        <div 
          className="absolute inset-0 z-[2]"
          style={{
            background: 'radial-gradient(ellipse at top left, transparent 0%, rgba(0, 0, 0, 0.15) 100%)',
          }}
        />

        {/* Top-Left LogMate Logo - Scales properly */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-block group">
            <div className="h-7 sm:h-8 lg:h-9 2xl:h-12 w-auto relative flex items-center">
              <Image
                src="/logMate-logo.webp"
                alt="LogMate Logo"
                width={200}
                height={60}
                className="h-7 sm:h-8 lg:h-9 2xl:h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center Typography - Properly scaled for all screens */}
        <div className="relative z-10 pt-2 sm:pt-3 lg:pt-4 2xl:pt-6 pb-3 sm:pb-4 lg:pb-5 2xl:pb-6 max-w-xl 2xl:max-w-2xl space-y-1 sm:space-y-1.5 lg:space-y-2 2xl:space-y-4">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[2.5rem] font-light tracking-tight leading-[1.15] 2xl:leading-[1.2] text-white font-display">
            <span className="inline-block relative font-['Playfair_Display'] italic font-semibold text-[1.15em] text-[#ffa726] drop-shadow-[0_2px_20px_rgba(255,140,0,0.4)]" 
              style={{
                textShadow: '0 2px 20px rgba(255, 140, 0, 0.4), 0 0 30px rgba(255, 140, 0, 0.2)'
              }}>
              Your
              <svg className="absolute -bottom-0.5 sm:-bottom-1 left-0 w-full h-0.5 sm:h-1" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,7 Q25,0 50,5 T100,4" stroke="#ff8c00" strokeWidth="1.5" fill="none" opacity="0.6"></path>
              </svg>
            </span>{' '}
            Work-Related <br />
            Learning Journey,{' '}
            <span className="inline-block relative font-['Playfair_Display'] italic font-semibold text-[1.15em] text-[#ffa726] drop-shadow-[0_2px_20px_rgba(255,140,0,0.4)]"
              style={{
                textShadow: '0 2px 20px rgba(255, 140, 0, 0.4), 0 0 30px rgba(255, 140, 0, 0.2)'
              }}>
              Simplified.
              <svg className="absolute -bottom-0.5 sm:-bottom-1 left-0 w-full h-0.5 sm:h-1 lg:h-1.5 2xl:h-2" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,7 Q25,0 50,5 T100,4" stroke="#ff8c00" strokeWidth="1.5" fill="none" opacity="0.6"></path>
              </svg>
            </span>
          </h1>

          <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg text-white/90 font-light leading-relaxed max-w-md 2xl:max-w-xl tracking-wide">
            Log your progress, document your activities, and track your growth.
            {' '}
            <span className="hidden lg:block mt-0.5 lg:mt-1 text-white/70 text-[10px] sm:text-xs md:text-sm lg:text-base 2xl:text-base">All in one elegant platform.</span>
          </p>
        </div>

        {/* Bottom 4 Feature Cards - Subtle & Non-Distracting */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 pt-2 sm:pt-3">
          {featureCards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-md sm:rounded-lg p-2 sm:p-2.5 transition-all duration-300 cursor-pointer"
            >
              {/* Icon Container - More subtle */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-md bg-white/10 group-hover:bg-white/15 flex items-center justify-center mb-1.5 transition-all duration-300">
                <card.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-white/70 group-hover:text-white/90" strokeWidth={2} />
              </div>
              
              {/* Content - Softer text */}
              <div>
                <h3 className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-white/80 group-hover:text-white/95 tracking-tight leading-tight mb-0.5 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[7px] sm:text-[8px] lg:text-[9px] text-white/50 group-hover:text-white/65 leading-snug font-light line-clamp-2 transition-colors">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT AUTH PANEL (Twilight Navy Campus from hero-new - Untouched) */}
      {/* ========================================================= */}
      <div
        className="relative w-full xl:w-[45%] min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 xl:p-10 bg-cover bg-center xl:bg-right overflow-hidden"
        style={{
          backgroundImage: "url('/hero-new.webp')",
        }}
      >
        {/* Auth Card - No Logo Duplication */}
        {/* ========================================================= */}
        {/* THE ELEVATED AUTH CARD - Ultra Clean Design */}
        {/* ========================================================= */}
        <div className="w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px] 2xl:max-w-[360px] relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/98 backdrop-blur-2xl rounded-lg sm:rounded-xl lg:rounded-2xl 2xl:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,15,40,0.4)] p-2.5 sm:p-3 md:p-4 lg:p-5 2xl:p-7 border border-white/80"
          >
            {/* Header - Scales up on very large screens */}
            <div className="text-center mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 2xl:mb-5 space-y-0.5 sm:space-y-0.5 2xl:space-y-1">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[1.4rem] 2xl:text-[1.75rem] font-light tracking-tight text-gray-900">
                Welcome{' '}
                <span className="inline-block relative font-['Playfair_Display'] italic font-semibold text-[#ffa726]"
                  style={{
                    textShadow: '0 2px 15px rgba(255, 140, 0, 0.25)'
                  }}>
                  Back
                  <svg className="absolute -bottom-0.5 left-0 w-full h-0.5 sm:h-0.5 lg:h-1 2xl:h-1.5" viewBox="0 0 100 6" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,4 T100,3" stroke="#ff8c00" strokeWidth="1.2" fill="none" opacity="0.5"></path>
                  </svg>
                </span>
              </h2>
              <p className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-xs text-gray-600 font-medium tracking-wider uppercase">
                Work-Related Learning Platform
              </p>
            </div>

            {/* Sign In / Register Tabs - Better scaling */}
            <div className="relative flex bg-gray-50 rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-2xl p-0.5 border border-gray-200/80 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 2xl:mb-5 select-none">
              <div className="relative flex-1">
                <motion.div
                  layoutId="tabActivePill"
                  className="absolute inset-0 bg-white rounded-md sm:rounded-lg lg:rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200"
                />
                <span className="relative z-10 flex-1 w-full py-0.5 sm:py-1 lg:py-1.5 2xl:py-2 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold tracking-wider text-[#002147] flex items-center justify-center">
                  SIGN IN
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push("/register/student")}
                className="flex-1 py-0.5 sm:py-1 lg:py-1.5 2xl:py-2 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold tracking-wider text-gray-400 hover:text-gray-700 transition-colors z-10 cursor-pointer rounded-md sm:rounded-lg lg:rounded-xl"
              >
                REGISTER
              </button>
            </div>

            {/* Sign In Form - Better scaling */}
            <form onSubmit={handleSubmit(onLogin)} className="space-y-1.5 sm:space-y-2 md:space-y-2.5 lg:space-y-3 2xl:space-y-3.5">
              {/* EMAIL */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label htmlFor="email-input" className="text-gray-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold tracking-wide">
                    Email Address
                  </label>
                  <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-xs text-gray-600 font-medium">Student ID or Email</span>
                </div>
                <Input
                  {...register("email")}
                  id="email-input"
                  type="text"
                  autoComplete="username"
                  placeholder="your.email@university.ac.zw"
                  className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 2xl:h-12 px-2 sm:px-2.5 lg:px-3 2xl:px-3.5 text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base 2xl:text-base bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20 rounded-md sm:rounded-lg lg:rounded-xl text-gray-900 placeholder:text-gray-400 transition-all"
                />
                {errors.email && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] mt-0.5 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label htmlFor="password-input" className="text-gray-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold tracking-wide">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-sm text-gray-700 hover:text-[#ffa726] font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 2xl:h-12 pl-2 sm:pl-2.5 lg:pl-3 2xl:pl-3.5 pr-7 sm:pr-8 lg:pr-9 2xl:pr-10 text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base 2xl:text-base bg-white border-gray-200 focus:border-[#ffa726] focus:ring-2 focus:ring-[#ffa726]/20 rounded-md sm:rounded-lg lg:rounded-xl text-gray-900 placeholder:text-gray-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-2.5 lg:right-3 2xl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" /> : <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] mt-0.5 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center text-xs 2xl:text-sm pt-0.5">
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#ffa726] focus:ring-[#ffa726] w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4"
                  />
                  <span className="font-semibold text-gray-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm">Remember me</span>
                </label>
              </div>

              {/* Primary CTA - Better scaling */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 2xl:h-12 bg-gradient-to-r from-[#002147] to-[#003a75] hover:from-[#001733] hover:to-[#002a5c] text-white font-semibold text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base 2xl:text-base tracking-wide rounded-md sm:rounded-lg lg:rounded-xl shadow-lg shadow-[#002147]/20 hover:shadow-xl hover:shadow-[#002147]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer mt-1 sm:mt-1.5 2xl:mt-2 group"
              >
                {isLoading ? (
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 group-hover:translate-x-1 transition-transform" />
                    <span>Sign In</span>
                  </>
                )}
              </Button>

              {/* Secure encrypted connection */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 2xl:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-sm pt-0.5 sm:pt-1 2xl:pt-1.5">
                <Lock className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 2xl:w-4 2xl:h-4 text-emerald-500" />
                <span className="font-semibold text-gray-800">Secure, encrypted connection</span>
              </div>
            </form>

          </motion.div>

          {/* Footer - Better scaling */}
          <div className="mt-2.5 sm:mt-3 md:mt-4 lg:mt-5 2xl:mt-6 text-center">
            <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white/80 font-light">
              &copy; {new Date().getFullYear()} University of Zimbabwe &middot; LogMate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
