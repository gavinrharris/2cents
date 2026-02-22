import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  authApi,
  meApi,
  setAuthToken,
  clearAuthToken,
  hasStoredToken,
} from "@/lib/api";

interface UserProfile {
  fullName: string;
  email: string;
  state: string;
  monthlyIncome: number;
  monthlyRent: number;
  carPayment: number;
  weeklyGrocery: number;
  eatingOutPerWeek: number;
  recurringExpenses: string;
  personality: "planner" | "spontaneous";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<{ hasCompletedOnboarding: boolean }>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: (profile: Omit<UserProfile, "email">) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  hasCompletedOnboarding: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function apiProfileToUser(profile: Record<string, unknown>): UserProfile {
  return {
    fullName: profile.fullName != null ? String(profile.fullName) : "",
    email: profile.email != null ? String(profile.email) : "",
    state: profile.state != null ? String(profile.state) : "",
    monthlyIncome: Number(profile.monthlyIncome ?? 0),
    monthlyRent: Number(profile.monthlyRent ?? 0),
    carPayment: Number(profile.carPayment ?? 0),
    weeklyGrocery: Number(profile.weeklyGrocery ?? 0),
    eatingOutPerWeek: Number(profile.eatingOutPerWeek ?? 0),
    recurringExpenses: profile.recurringExpenses != null ? String(profile.recurringExpenses) : "",
    personality: (profile.personality === "spontaneous" ? "spontaneous" : "planner"),
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    try {
      const data = await meApi.get();
      const profile = data.profile as Record<string, unknown>;
      setUser(apiProfileToUser(profile));
      setHasCompletedOnboarding(!!data.hasCompletedOnboarding);
      setIsAuthenticated(true);
    } catch {
      clearAuthToken();
      setUser(null);
      setHasCompletedOnboarding(false);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasStoredToken()) {
      setLoading(false);
      return;
    }
    loadMe();
  }, [loadMe]);

  const login = async (email: string, password: string): Promise<{ hasCompletedOnboarding: boolean }> => {
    const data = await authApi.login(email, password);
    setAuthToken(data.token);
    const me = await meApi.get();
    setUser(apiProfileToUser(me.profile as Record<string, unknown>));
    const completed = !!me.hasCompletedOnboarding;
    setHasCompletedOnboarding(completed);
    setIsAuthenticated(true);
    return { hasCompletedOnboarding: completed };
  };

  const register = async (email: string, password: string) => {
    const data = await authApi.register(email, password);
    setAuthToken(data.token);
    if (data.hasCompletedOnboarding) {
      const me = await meApi.get();
      setUser(apiProfileToUser(me.profile as Record<string, unknown>));
      setHasCompletedOnboarding(true);
    } else {
      setUser({
        fullName: "",
        email,
        state: "",
        monthlyIncome: 0,
        monthlyRent: 0,
        carPayment: 0,
        weeklyGrocery: 0,
        eatingOutPerWeek: 0,
        recurringExpenses: "",
        personality: "planner",
      });
      setHasCompletedOnboarding(false);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setHasCompletedOnboarding(false);
    setIsAuthenticated(false);
  };

  const completeOnboarding = async (profile: Omit<UserProfile, "email">) => {
    const body = {
      fullName: profile.fullName,
      state: profile.state,
      monthlyIncome: profile.monthlyIncome,
      monthlyRent: profile.monthlyRent,
      carPayment: profile.carPayment,
      weeklyGrocery: profile.weeklyGrocery,
      eatingOutPerWeek: profile.eatingOutPerWeek,
      recurringExpenses: profile.recurringExpenses,
      personality: profile.personality,
    };
    const data = await meApi.put(body);
    setUser(apiProfileToUser(data.profile as Record<string, unknown>));
    setHasCompletedOnboarding(true);
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    const body: Record<string, unknown> = {};
    if (profile.fullName !== undefined) body.fullName = profile.fullName;
    if (profile.state !== undefined) body.state = profile.state;
    if (profile.monthlyIncome !== undefined) body.monthlyIncome = profile.monthlyIncome;
    if (profile.monthlyRent !== undefined) body.monthlyRent = profile.monthlyRent;
    if (profile.carPayment !== undefined) body.carPayment = profile.carPayment;
    if (profile.weeklyGrocery !== undefined) body.weeklyGrocery = profile.weeklyGrocery;
    if (profile.eatingOutPerWeek !== undefined) body.eatingOutPerWeek = profile.eatingOutPerWeek;
    if (profile.recurringExpenses !== undefined) body.recurringExpenses = profile.recurringExpenses;
    if (profile.personality !== undefined) body.personality = profile.personality;
    const data = await meApi.put(body);
    setUser(apiProfileToUser(data.profile as Record<string, unknown>));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        completeOnboarding,
        updateProfile,
        hasCompletedOnboarding,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
