const BASE_URL = "http://localhost:5000/api";

// ── Get token from localStorage ──────────────
const getToken = (): string => {
  if (typeof window === "undefined") return "";
  
  // Try multiple storage keys for compatibility
  const userStr = localStorage.getItem("user") || localStorage.getItem("rentmanager_user");
  if (!userStr) return "";
  
  try {
    const user = JSON.parse(userStr);
    return user.token || "";
  } catch {
    return "";
  }
};

// ── Base fetch helper ────────────────────────
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Invalid JSON response (HTTP ${res.status})`);
    }

    if (!res.ok) {
      const errorMsg = data?.message || res.statusText || 'Unknown error';
      throw new Error(`${res.status}: ${errorMsg}`);
    }

    if (!data.success) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Cannot connect to API at ${BASE_URL}. Is the backend server running on localhost:5000?`);
    }
    throw error;
  }
};

// ── Auth API ─────────────────────────────────
export const authAPI = {
  login:   (body: any) => request("/auth/login",    { method: "POST", body: JSON.stringify(body) }),
  register:(body: any) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  profile: ()         => request("/auth/profile"),
  updateProfile:   (body: any) => request("/auth/profile",         { method: "PUT",  body: JSON.stringify(body) }),
  changePassword:  (body: any) => request("/auth/change-password", { method: "PUT",  body: JSON.stringify(body) }),
};

// ── Properties API ───────────────────────────
export const propertyAPI = {
  getAll:   ()             => request("/properties"),
  getOne:   (id: number)   => request(`/properties/${id}`),
  create:   (body: object) => request("/properties",      { method: "POST",   body: JSON.stringify(body) }),
  update:   (id: number, body: object) => request(`/properties/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete:   (id: number)   => request(`/properties/${id}`, { method: "DELETE" }),
};

// ── Units API ────────────────────────────────
export const unitAPI = {
  getByProperty: (propertyId: number) => request(`/units/property/${propertyId}`),
  create:  (body: object)             => request("/units",      { method: "POST",   body: JSON.stringify(body) }),
  update:  (id: number, body: object) => request(`/units/${id}`, { method: "PUT",   body: JSON.stringify(body) }),
  delete:  (id: number)               => request(`/units/${id}`, { method: "DELETE" }),
};

// ── Tenants API ──────────────────────────────
export const tenantAPI = {
  getAll:  ()                          => request("/tenants"),
  getOne:  (id: number)                => request(`/tenants/${id}`),
  create:  (body: object)              => request("/tenants",      { method: "POST", body: JSON.stringify(body) }),
  update:  (id: number, body: object)  => request(`/tenants/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ── Leases API ───────────────────────────────
export const leaseAPI = {
  getAll:  ()                          => request("/leases"),
  create:  (body: object)              => request("/leases",      { method: "POST", body: JSON.stringify(body) }),
  update:  (id: number, body: object)  => request(`/leases/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ── Payments API ─────────────────────────────
export const paymentAPI = {
  getAll:  ()                          => request("/payments"),
  getStats:()                          => request("/payments/stats"),
  create:  (body: object)              => request("/payments",      { method: "POST", body: JSON.stringify(body) }),
  update:  (id: number, body: object)  => request(`/payments/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ── Invoices API ─────────────────────────────
export const invoiceAPI = {
  getAll:  ()                          => request("/invoices"),
  getOne:  (id: number)                => request(`/invoices/${id}`),
  create:  (body: object)              => request("/invoices",      { method: "POST", body: JSON.stringify(body) }),
  update:  (id: number, body: object)  => request(`/invoices/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete:  (id: number)               => request(`/invoices/${id}`, { method: "DELETE" }),
};

// ── Maintenance API ──────────────────────────
export const maintenanceAPI = {
  getAll:  ()                          => request("/maintenance"),
  create:  (body: object)              => request("/maintenance",      { method: "POST", body: JSON.stringify(body) }),
  update:  (id: number, body: object)  => request(`/maintenance/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ── Messages API ─────────────────────────────
export const messageAPI = {
  getConversations: ()                 => request("/messages"),
  getMessages:      (userId: number)   => request(`/messages/${userId}`),
  send:             (body: object)     => request("/messages", { method: "POST", body: JSON.stringify(body) }),
};

// ── Analytics API ────────────────────────────
export const analyticsAPI = {
  ownerStats:  () => request("/analytics/owner"),
  tenantStats: () => request("/analytics/tenant"),
};

// ── Notifications API ────────────────────────
export const notificationAPI = {
  getAll:     ()           => request("/notifications"),
  markRead:   (id: number) => request(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead:()           => request("/notifications/read-all",   { method: "PUT" }),
};