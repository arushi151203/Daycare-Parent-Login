import { useState } from "react";
import Toast from "./components/Toast";
import LoginScreen from "./pages/LoginScreen";
import OtpVerifyScreen from "./pages/OtpVerifyScreen";
import RegisterScreen from "./pages/RegisterScreen";
import RegisterComplete from "./pages/RegisterComplete";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import DashboardScreen from "./pages/DashboardScreen";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [params, setParams] = useState({});
  const [toast, setToast] = useState(null);

  function navigate(screenName, screenParams = {}) {
    setScreen(screenName);
    setParams(screenParams);
  }

  function showToast(message) {
    setToast(message);
  }

  const commonProps = { navigate, showToast };

  return (
    <div className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Nunito', sans-serif; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-slide-up { animation: slide-up 0.3s ease; }
      `}</style>

      {screen === "login"              && <LoginScreen          {...commonProps} />}
      {screen === "register"           && <RegisterScreen       {...commonProps} />}
      {screen === "otp-verify"         && <OtpVerifyScreen      {...commonProps} params={params} />}
      {screen === "register-complete"  && <RegisterComplete     {...commonProps} params={params} />}
      {screen === "forgot-password"    && <ForgotPasswordScreen {...commonProps} />}
      {screen === "dashboard"          && <DashboardScreen      {...commonProps} />}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}