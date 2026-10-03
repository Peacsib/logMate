"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { AuthUser } from "@/utils/mockData"

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthInnerProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (session?.user) {
      const u: AuthUser = {
        id: (session.user as any).id || "",
        name: session.user.name || "User",
        email: session.user.email || "",
        role: (((session.user as any).role || "student") as string).toLowerCase() as any,
        avatar: session.user.image || undefined,
      }
      setUser(u)
      if (typeof window !== "undefined") {
        localStorage.setItem("wrl_user", JSON.stringify(u))
      }
    } else if (status === "unauthenticated") {
      const stored = typeof window !== "undefined" ? localStorage.getItem("wrl_user") : null;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // If stored user was dummy 'u1' or mock id, clear it
          if (parsed?.id === "u1" || parsed?.email?.includes("mock")) {
            localStorage.removeItem("wrl_user");
            setUser(null);
          } else {
            setUser(parsed);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, [session, status])

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await signIn("credentials", {
        email: username.trim(),
        password,
        redirect: false,
      });

      if (!res?.error) {
        try {
          const sessionRes = await fetch("/api/auth/session");
          const sessionData = await sessionRes.json();
          if (sessionData?.user) {
            const u: AuthUser = {
              id: sessionData.user.id || "",
              name: sessionData.user.name || username,
              email: sessionData.user.email || username,
              role: ((sessionData.user.role || "student") as string).toLowerCase() as any,
              avatar: sessionData.user.image || undefined,
            };
            setUser(u);
            if (typeof window !== "undefined") {
              localStorage.setItem("wrl_user", JSON.stringify(u));
            }
            return true;
          }
        } catch (sessionErr) {
          console.error("Error retrieving session after login:", sessionErr);
        }
        return true;
      }

      return false;
    } catch (e) {
      console.error("Login failed:", e);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("wrl_user");
      }
      await signOut({ redirect: false });
    } catch (e) {
      console.error("Logout error:", e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading: status === "loading",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
