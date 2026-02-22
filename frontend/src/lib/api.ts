const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("2cents_token");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function setAuthToken(token: string) {
  localStorage.setItem("2cents_token", token);
}

export function clearAuthToken() {
  localStorage.removeItem("2cents_token");
}

export function hasStoredToken() {
  return !!getToken();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, recoveryEmail?: string) =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, recoveryEmail }),
    }),
};

// Me (profile) – requires auth
export const meApi = {
  get: () => apiFetch("/api/me"),
  put: (body: Record<string, unknown>) =>
    apiFetch("/api/me", { method: "PUT", body: JSON.stringify(body) }),
};

// Dashboard – requires auth
export const dashboardApi = {
  getStats: () => apiFetch("/api/dashboard/stats"),
};

// Reports – requires auth
export const reportsApi = {
  getSpendingTrend: () => apiFetch("/api/reports/spending-trend"),
  getSpendingBreakdown: () => apiFetch("/api/reports/spending-breakdown"),
  getSavingsTrend: () => apiFetch("/api/reports/savings-trend"),
  getDailyTips: () => apiFetch("/api/reports/daily-tips"),
};

// Chat – requires auth
export const chatApi = {
  send: (message: string) =>
    apiFetch("/api/chat", { method: "POST", body: JSON.stringify({ message }) }),
};
