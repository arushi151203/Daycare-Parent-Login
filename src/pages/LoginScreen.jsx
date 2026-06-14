import { useState } from "react";
import Card from "../components/Card";
import Logo from "../components/Logo";
import BackLink from "../components/BackLink";
import RoleTabs from "../components/RoleTabs";
import MethodToggle from "../components/MethodToggle";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { sendOtp, loginWithPassword } from "../api";

export default function LoginScreen({ navigate, showToast }) {
  const [role, setRole] = useState("Parent");
  const [method, setMethod] = useState("OTP Login");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  function validatePhone(value) {
    if (!value.trim()) return "Please enter your phone number";
    if (!/^\d+$/.test(value)) return "Phone number must contain only digits";
    if (value.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
  }

  async function handleSubmit() {
    if (method === "OTP Login") {
      const phoneErr = validatePhone(phone);
      if (phoneErr) { setError(phoneErr); return; }
      setError("");
      setLoading(true);
      try {
        await sendOtp(phone);
        navigate("otp-verify", {
          phone,
          nextScreen: "dashboard",
          toastMsg: "OTP verified successfully!",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to send OTP. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      let valid = true;
      if (!email.trim()) { setEmailError("Please enter your email"); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Please enter a valid email address"); valid = false; }
      else setEmailError("");
      if (!password.trim()) { setPasswordError("Please enter your password"); valid = false; }
      else setPasswordError("");
      if (!valid) return;

      setLoading(true);
      try {
        const res = await loginWithPassword(email, password);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        showToast("Login successful!");
        navigate("dashboard");
      } catch (err) {
        setPasswordError(err.response?.data?.message || "Login failed. Check your credentials.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Card>
      <BackLink label="Back to Home" onClick={() => {}} />
      <Logo />
      <p className="text-center text-gray-400 text-sm mb-6">Login to your account</p>

      <RoleTabs role={role} setRole={setRole} />

      <MethodToggle method={method} setMethod={setMethod} />

      {method === "OTP Login" ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <Input
              icon="phone"
              type="tel"
              placeholder="+91 97284 13153"
              value={phone}
              hasError={!!error}
              onChange={(e) => { setPhone(e.target.value); if (error) setError(""); }}
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>
          <Btn onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Btn>
        </>
      ) : (
        <>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <Input
              icon="mail"
              type="email"
              placeholder="your@gmail.com"
              value={email}
              hasError={!!emailError}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
            />
            {emailError && <p className="text-red-400 text-xs mt-1.5">{emailError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <Input
              icon="lock"
              type="password"
              placeholder="Enter your password"
              value={password}
              hasError={!!passwordError}
              onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(""); }}
            />
            {passwordError && <p className="text-red-400 text-xs mt-1.5">{passwordError}</p>}
          </div>
          <Btn onClick={handleSubmit} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Btn>
        </>
      )}

      <p className="text-center mt-4">
        <button
          onClick={() => navigate("forgot-password")}
          className="text-orange-400 text-sm font-medium hover:text-orange-500 transition"
        >
          Forgot Password?
        </button>
      </p>

      <div className="border-t border-gray-100 mt-5 pt-4 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("register")}
          className="text-orange-400 font-semibold hover:text-orange-500 transition"
        >
          Create Parent Account
        </button>
      </div>
    </Card>
  );
}