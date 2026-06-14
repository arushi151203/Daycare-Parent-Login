import { useState } from "react";
import Card from "../components/Card";
import Logo from "../components/Logo";
import BackLink from "../components/BackLink";
import OtpBoxes from "../components/OtpBoxes";
import Btn from "../components/Btn";
import { verifyOtp, sendOtp, sendRegisterOtp } from "../api";

export default function OtpVerifyScreen({ navigate, showToast, params }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    phone,
    nextScreen,
    nextParams,
    toastMsg,
    isRegister,
  } = params || {};

  async function handleVerify() {
    const cleanOtp = otp.replace(/\s/g, "");

    if (cleanOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await verifyOtp(phone, cleanOtp);

      // Save token if returned (login flow)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      showToast(toastMsg || "OTP verified successfully!");

      // Navigate to next screen with all params
      navigate(nextScreen || "dashboard", nextParams || {});

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setOtp("");
    setError("");
    try {
      if (isRegister) {
        await sendRegisterOtp(phone);
      } else {
        await sendOtp(phone);
      }
      showToast("OTP resent successfully!");
    } catch (err) {
      showToast("Failed to resend OTP. Try again.");
    }
  }

  return (
    <Card>
      <BackLink label="Back" onClick={() => navigate("login")} />
      <Logo />
      <h2 className="text-xl font-bold text-center text-gray-800 mt-2">
        Verify OTP
      </h2>
      <p className="text-center text-gray-400 text-sm mt-1">
        Enter the 6-digit code sent to
        <br />
        <span className="font-semibold text-gray-600">{phone || "your number"}</span>
      </p>

      <OtpBoxes value={otp} onChange={setOtp} />

      {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}

      <Btn onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </Btn>

      <p className="text-center text-sm text-gray-400 mt-4">
        Didn't receive the code?{" "}
        <button
          onClick={handleResend}
          className="text-orange-400 font-semibold hover:text-orange-500 transition"
        >
          Resend OTP
        </button>
      </p>
    </Card>
  );
}