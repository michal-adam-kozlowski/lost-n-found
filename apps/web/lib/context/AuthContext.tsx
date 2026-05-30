"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  refreshAuth: async () => {},
});

async function fetchAuth(): Promise<{ token: string; user: AuthUser } | null> {
  try {
    const res = await fetch("/api/token");
    if (!res.ok) return null;
    return (await res.json()) as { token: string; user: AuthUser } | null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshAuth = useCallback(async () => {
    const data = await fetchAuth();
    setToken(data?.token ?? null);
    setUser(data?.user ?? null);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshAuth();
  }, [refreshAuth]);

  return <AuthContext.Provider value={{ token, user, refreshAuth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
