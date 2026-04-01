import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AuthUser } from "@/types/auth";
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "@/lib/storage";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (token: string, user?: AuthUser | null) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setCurrentToken] = useState<string | null>(null);
  const [user, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentToken(getToken());
    setCurrentUser(getStoredUser());
  }, []);

  const signIn = useCallback((nextToken: string, nextUser?: AuthUser | null) => {
    setToken(nextToken);
    setCurrentToken(nextToken);

    if (nextUser) {
      setStoredUser(nextUser);
      setCurrentUser(nextUser);
    }
  }, []);

  const signOut = useCallback(() => {
    clearAuthStorage();
    setCurrentToken(null);
    setCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [signIn, signOut, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
