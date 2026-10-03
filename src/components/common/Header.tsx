"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { NetworkStatus } from "@/components/common/NetworkStatus";
import { NotificationBell } from "@/components/common/NotificationBell";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface Props {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Determine which logo to use based on theme
  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light";
  const logoSrc = currentTheme === "dark" ? "/logMate-logo.webp" : "/logMate-logo-dark.webp";

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
          <Menu className="w-5 h-5" />
        </Button>
        {mounted && <img src={logoSrc} alt="LogMate" className="h-8 w-auto" />}
      </div>
      <div className="flex items-center gap-2">
        <NetworkStatus />
        <ThemeToggle />
        <NotificationBell />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user?.name?.charAt(0)}
          </div>
          <span className="text-sm font-medium hidden md:block">{user?.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
