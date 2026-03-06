import { Donation, Program, Volunteer } from "@pws/shared";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptors ---

// Request Interceptor: Attach token safely
api.interceptors.request.use(
  (config) => {
    // SSR Safety Check: Only access localStorage if we are in the browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("pws_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle token expiration globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 Unauthorized, the token is invalid/expired
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("pws_token");
      localStorage.removeItem("pws_user");
      // Optional: Redirect to login page if they aren't already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// --- Domain APIs ---

export const programsApi = {
  getAll: async (): Promise<Program[]> => {
    const response = await api.get("/programs");
    return response.data;
  },
  getById: async (id: string): Promise<Program> => {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  },
  create: async (programData: Omit<Program, "id">): Promise<Program> => {
    const response = await api.post("/programs", programData);
    return response.data;
  },
  update: async (
    id: string,
    programData: Partial<Omit<Program, "id">>,
  ): Promise<Program> => {
    const response = await api.patch(`/programs/${id}`, programData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/programs/${id}`);
  },
};

export const eventsApi = {
  getAll: async () => {
    const response = await api.get("/events");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  create: async (eventData: any) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },
  update: async (id: string, eventData: any) => {
    const response = await api.patch(`/events/${id}`, eventData);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/events/${id}`);
  },
};

export const donationsApi = {
  getAll: async (): Promise<Donation[]> => {
    const response = await api.get("/donations");
    return response.data;
  },
  getById: async (id: string): Promise<Donation> => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },
  create: async (
    donationData: Omit<Donation, "id" | "createdAt" | "updatedAt">,
  ): Promise<Donation> => {
    const response = await api.post("/donations", donationData);
    return response.data;
  },
  update: async (
    id: string,
    donationData: Partial<Omit<Donation, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Donation> => {
    const response = await api.patch(`/donations/${id}`, donationData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/donations/${id}`);
  },

  // Payment flow endpoints
  checkout: async (
    data: Omit<
      Donation,
      | "id"
      | "status"
      | "paymentId"
      | "PaymentOrderId"
      | "createdAt"
      | "updatedAt"
    >,
  ): Promise<{ donationId: string; orderId: string; keyId: string }> => {
    const response = await api.post("/payments/razorpay/checkout", data); // Adjusted to match typical payment route structure
    return response.data;
  },
  verifyPayment: async (data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<void> => {
    await api.post("/donations/verify", data);
  },
};

export const volunteersApi = {
  getAll: async (): Promise<Volunteer[]> => {
    const response = await api.get("/volunteers");
    return response.data;
  },
  getById: async (id: string): Promise<Volunteer> => {
    const response = await api.get(`/volunteers/${id}`);
    return response.data;
  },
  create: async (
    volunteerData: Omit<Volunteer, "id" | "joinedDate">,
  ): Promise<Volunteer> => {
    const response = await api.post("/volunteers", volunteerData);
    return response.data;
  },
  update: async (
    id: string,
    volunteerData: Partial<Omit<Volunteer, "id" | "joinedDate">>,
  ): Promise<Volunteer> => {
    const response = await api.patch(`/volunteers/${id}`, volunteerData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/volunteers/${id}`);
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });

    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("pws_token", response.data.token);
      localStorage.setItem("pws_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("pws_token", response.data.token);
      localStorage.setItem("pws_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pws_token");
      localStorage.removeItem("pws_user");
    }
  },

  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("pws_user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pws_token");
    }
    return null;
  },
};

export const postsApi = {
  getAll: async () => {
    const response = await api.get("/posts");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  create: async (postData: any) => {
    const response = await api.post("/posts", postData);
    return response.data;
  },
  update: async (id: string, postData: any) => {
    const response = await api.patch(`/posts/${id}`, postData);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/posts/${id}`);
  },
};

export const galleryApi = {
  getAll: async () => {
    const response = await api.get("/gallery");
    return response.data;
  },
  create: async (imageData: any) => {
    const response = await api.post("/gallery", imageData);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/gallery/${id}`);
  },
};
