import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient, setAccessToken } from "@/lib/api-client";

export type AppRole = "ADMIN" | "STUDENT";

type User = {
  id: string;
  email: string;
  fullName: string | null;
  role: AppRole;
};

type AuthState = {
  session: { user: User } | null;
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
  login: async () => {},
  register: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [loading, setLoading] = useState(true);

  // Storage decision: We keep accessToken purely in memory (via setAccessToken)
  // to avoid XSS exfiltration risks. We only persist the refreshToken in localStorage
  // for silent session restoration across reloads.
  
  const restoreSession = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        
        const user = await apiClient("/auth/me");
        setSession({ user });
      } else {
        localStorage.removeItem("refreshToken");
        setSession(null);
      }
    } catch (error) {
      localStorage.removeItem("refreshToken");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (data: any) => {
    const res = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAccessToken(res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    setSession({ user: res.user });
    return res;
  };

  const register = async (data: any) => {
    const res = await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAccessToken(res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    setSession({ user: res.user });
    return res;
  };

  const signOut = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await apiClient("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        // Ignore failure on logout
      }
    }
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    setSession(null);
  };

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      role: session?.user?.role ?? null,
      loading,
      signOut,
      login,
      register,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
