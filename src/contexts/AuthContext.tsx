import React, { createContext, useContext, useState, ReactNode } from "react";

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
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
  completeOnboarding: (profile: Omit<UserProfile, "email">) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  hasCompletedOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string, _password: string) => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);
    setUser({
      fullName: "Alex Morgan",
      email,
      state: "California",
      monthlyIncome: 6500,
      monthlyRent: 1800,
      carPayment: 350,
      weeklyGrocery: 120,
      eatingOutPerWeek: 3,
      recurringExpenses: "Netflix $15, Gym $40, Spotify $10",
      personality: "planner",
    });
  };

  const register = (email: string, _password: string) => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(false);
    setUser({ fullName: "", email, state: "", monthlyIncome: 0, monthlyRent: 0, carPayment: 0, weeklyGrocery: 0, eatingOutPerWeek: 0, recurringExpenses: "", personality: "planner" });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setUser(null);
  };

  const completeOnboarding = (profile: Omit<UserProfile, "email">) => {
    setUser((prev) => prev ? { ...prev, ...profile } : null);
    setHasCompletedOnboarding(true);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => prev ? { ...prev, ...profile } : null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, completeOnboarding, updateProfile, hasCompletedOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
