import { useState } from "react";
import Card from "../components/Card";
import Logo from "../components/Logo";
import BackLink from "../components/BackLink";
import Steps from "../components/Steps";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { sendRegisterOtp } from "../api";

export default function RegisterScreen({
  navigate,
  showToast,
  startStep = 1,
  savedName = "",
  savedPhone = "",
  savedEmail = "",
  savedPassword = "",
  savedChildName = "",
  savedChildAge = "",
}) {
  const [step, setStep] = useState(startStep);
  const [name, setName] = useState(savedName);
  const [nameError, setNameError] = useState("");
  const [phone, setPhone] = useState(savedPhone);
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState(savedEmail);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState(savedPassword);
  const [childName, setChildName] = useState(savedChildName);
  const [childAge, setChildAge] = useState(savedChildAge);
  const [loading, setLoading] = useState(false);

  // Step 1 — just validate and go to step 2, no OTP yet
  function goStep1() {
    if (!name.trim()) { setNameError("Please enter your full name"); return; }
    if (!phone.trim()) { setPhoneError("Please enter your phone number"); return; }
    if (!/^\d+$/.test(phone)) { setPhoneError("Phone number must contain only digits"); return; }
    if (phone.length !== 10) { setPhoneError("Phone number must be exactly 10 digits"); return; }
    setNameError(""); setPhoneError("");
    setStep(2);
  }

  // Step 2 — validate email if provided and go to step 3
  function goStep2() {
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setStep(3);
  }

  // Step 3 — send OTP then go to verify
  async function complete() {
    if (loading) return;
    setLoading(true);
    try {
      await sendRegisterOtp(phone);
      // After OTP verify — go to register-complete with all data
      navigate("otp-verify", {
        phone,
        isRegister: true,
        nextScreen: "register-complete",
        nextParams: { phone, name, email, password, childName, childAge },
        toastMsg: "OTP verified successfully!",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <BackLink label="Back to Login" onClick={() => navigate("login")} />
      <Logo />
      <p className="text-center text-gray-400 text-sm mb-5">Create Parent Account</p>
      <Steps current={step} />

      {/* Step 1 — Name & Phone */}
      {step === 1 && (
        <>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <Input
              icon="user"
              placeholder="John Doe"
              value={name}
              hasError={!!nameError}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(""); }}
            />
            {nameError && <p className="text-red-400 text-xs mt-1.5">{nameError}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-red-400">*</span>
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
          <Btn onClick={goStep1}>Continue</Btn>
        </>
      )}

      {/* Step 2 — Email & Password (optional) */}
      {step === 2 && (
        <>
          <p className="text-xs text-gray-400 mb-4">
            Optional: Set up email and password for faster login
          </p>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email (Optional)
            </label>
            <Input
              icon="mail"
              type="email"
              placeholder="your@email.com"
              value={email}
              hasError={!!emailError}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
            />
            {emailError && <p className="text-red-400 text-xs mt-1.5">{emailError}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password (Optional)
            </label>
            <Input
              icon="lock"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" onClick={() => setStep(1)}>Back</Btn>
            <Btn onClick={goStep2}>Continue</Btn>
          </div>
        </>
      )}

      {/* Step 3 — Child info (optional) */}
      {step === 3 && (
        <>
          <p className="text-xs text-gray-400 mb-4">
            Optional: Add your child's information (you can add more later)
          </p>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Child's Name (Optional)
            </label>
            <Input
              icon="user"
              placeholder="Emma"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Child's Age (Optional)
            </label>
            <Input
              placeholder="3 years"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" onClick={() => setStep(2)}>Back</Btn>
            <Btn onClick={complete} disabled={loading}>
              {loading ? "Sending OTP..." : "Complete Registration"}
            </Btn>
          </div>
        </>
      )}

      <div className="border-t border-gray-100 mt-5 pt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
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