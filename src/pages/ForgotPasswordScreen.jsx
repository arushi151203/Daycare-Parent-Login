import { useState } from "react";
import Card from "../components/Card";
import Logo from "../components/Logo";
import BackLink from "../components/BackLink";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { forgotPasswordSendOtp, forgotPasswordVerifyOtp, resetPassword } from "../api";

export default function ForgotPasswordScreen({ navigate, showToast }) {
  const [fpStep, setFpStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    if (!phone.trim()) { setPhoneError("Please enter your phone number"); return; }
    if (!/^\d+$/.test(phone)) { setPhoneError("Phone number must contain only digits"); return; }
    if (phone.length !== 10) { setPhoneError("Phone number must be exactly 10 digits"); return; }
    setPhoneError("");
    setLoading(true);
    try {
      await forgotPasswordSendOtp(phone);
      showToast("OTP sent to your phone!");
      setFpStep(2);
    } catch (err) {
      setPhoneError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp.trim().length < 6) { setOtpError("Please enter the complete 6-digit OTP"); return; }
    setOtpError("");
    setLoading(true);
    try {
      const res = await forgotPasswordVerifyOtp(phone, otp);
      setResetToken(res.data.resetToken);
      setFpStep(3);
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!newPwd.trim()) { setPwdError("Please enter a new password"); return; }
    if (newPwd.length < 6) { setPwdError("Password must be at least 6 characters"); return; }
    if (newPwd !== confirmPwd) { setPwdError("Passwords do not match"); return; }
    setPwdError("");
    setLoading(true);
    try {
      await resetPassword(resetToken, newPwd);
      showToast("Password reset successfully!");
      navigate("login");
    } catch (err) {
      setPwdError(err.response?.data?.message || "Reset failed. Please start again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <BackLink label="Back to Login" onClick={() => navigate("login")} />
      <Logo />
      <p className="text-center text-gray-500 text-sm mb-6">Reset Your Password</p>

      {fpStep === 1 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Enter your registered phone number to receive an OTP
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <Input
              icon="phone"
              type="tel"
              placeholder="+91 97284 13153"
              value={phone}
              hasError={!!phoneError}
              onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(""); }}
            />
            {phoneError && <p className="text-red-400 text-xs mt-1.5">{phoneError}</p>}
          </div>
          <Btn onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Btn>
        </>
      )}

      {fpStep === 2 && (
        <>
          <p className="text-sm text-gray-500 mb-1">
            Enter the 6-digit OTP sent to {phone}
          </p>
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1.5">
            OTP Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); if (otpError) setOtpError(""); }}
            className={`w-full border-2 rounded-xl py-3 px-4 text-center text-lg font-bold tracking-widest focus:outline-none bg-gray-50 transition mb-1 ${
              otpError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-orange-400"
            }`}
          />
          {otpError && <p className="text-red-400 text-xs mb-3">{otpError}</p>}
          <div className="flex gap-3 mt-3">
            <Btn variant="outline" onClick={() => setFpStep(1)}>Back</Btn>
            <Btn onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Btn>
          </div>
          <p className="text-center mt-3">
            <button
              onClick={() => { setOtp(""); sendOtp(); }}
              className="text-orange-400 text-sm font-medium hover:text-orange-500 transition"
            >
              Resend OTP
            </button>
          </p>
        </>
      )}

      {fpStep === 3 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Create a new password for your account
          </p>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <Input
              icon="lock"
              type="password"
              placeholder="At least 6 characters"
              value={newPwd}
              onChange={(e) => { setNewPwd(e.target.value); if (pwdError) setPwdError(""); }}
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <Input
              icon="lock"
              type="password"
              placeholder="Re-enter password"
              value={confirmPwd}
              hasError={!!pwdError}
              onChange={(e) => { setConfirmPwd(e.target.value); if (pwdError) setPwdError(""); }}
            />
            {pwdError && <p className="text-red-400 text-xs mt-1.5">{pwdError}</p>}
          </div>
          <Btn onClick={handleReset} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Btn>
        </>
      )}

      <div className="border-t border-gray-100 mt-5 pt-4 text-center text-sm text-gray-500">
        Remember your password?{" "}
        <button
          onClick={() => navigate("login")}
          className="text-orange-400 font-semibold hover:text-orange-500 transition"
        >
          Login here
        </button>
      </div>
    </Card>
  );
}