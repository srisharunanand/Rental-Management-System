// utils/auth.ts
// Simple client-side auth helper using localStorage.
// Replace with real JWT/session logic when backend is ready.

export type UserRole = "owner" | "tenant";

export interface AuthUser {
  name:  string;
  email: string;
  role:  UserRole;
}

const KEY = "rentmanager_user";

/** Save user info after login */
export function saveUser(user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(user));
  }
}

/** Read saved user (null if not logged in) */
export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Remove user on logout */
export function clearUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
  }
}

/** Where should this role land after login? */
export function dashboardPath(role: UserRole): string {
  return role === "owner" ? "/owner/dashboard" : "/tenant/dashboard";
}