import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export const sendOtp = (phone) =>
  api.post("/auth/send-otp", { phone });

export const sendRegisterOtp = (phone) =>
  api.post("/auth/register/send-otp", { phone });

export const verifyOtp = (phone, otp) =>
  api.post("/auth/verify-otp", { phone, otp });

export const loginWithPassword = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const forgotPasswordSendOtp = (phone) =>
  api.post("/auth/forgot-password/send-otp", { phone });

export const forgotPasswordVerifyOtp = (phone, otp) =>
  api.post("/auth/forgot-password/verify-otp", { phone, otp });

export const resetPassword = (resetToken, newPassword) =>
  api.post("/auth/forgot-password/reset", { resetToken, newPassword });