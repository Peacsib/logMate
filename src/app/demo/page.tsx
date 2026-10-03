"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import IntegrationCardDemo from "@/components/ui/integration-card";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-14 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
        <Link href="/student" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Component Showcase
          </span>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl">
          <IntegrationCardDemo />
        </div>
      </main>
    </div>
  );
}
