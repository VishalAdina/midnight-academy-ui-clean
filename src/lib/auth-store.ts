import { apiClient, setAccessToken } from "./api-client";

export type AppRole = "ADMIN" | "STUDENT";

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  role: AppRole;
};

type AuthState = {
  user: User | null;
  loading: boolean;
};

let state: AuthState = { user: null, loading: true };
let listeners: (() => void)[] = [];
let restorePromise: Promise<void> | null = null;

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function updateState(newState: Partial<AuthState>) {
  state = { ...state, ...newState };
  notify();
}

async function doRestoreSession(): Promise<void> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    updateState({ user: null, loading: false });
    return;
  }
  
  try {
    const response = await fetch(`${import.meta.env['VITE_API_URL'] || "http://localhost:3000"}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      const user = await apiClient("/auth/me");
      updateState({ user, loading: false });
    } else {
      localStorage.removeItem("refreshToken");
      updateState({ user: null, loading: false });
    }
  } catch (error) {
    localStorage.removeItem("refreshToken");
    updateState({ user: null, loading: false });
  }
}

export const authStore = {
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  
  getSnapshot() {
    return state;
  },

  getUser() {
    return state.user;
  },
  
  getRole() {
    return state.user?.role ?? null;
  },

  getRestorePromise() {
    if (!restorePromise) {
      restorePromise = doRestoreSession();
    }
    return restorePromise;
  },

  async login(data: any) {
    const res = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAccessToken(res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    updateState({ user: res.user });
    return res;
  },

  async register(data: any) {
    const res = await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAccessToken(res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    updateState({ user: res.user });
    return res;
  },

  async signOut() {
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
    updateState({ user: null });
  },
};
