import { useEffect, useState } from "react";
import Card from "../components/Card";
import Logo from "../components/Logo";
import { registerUser } from "../api";

export default function RegisterComplete({ navigate, showToast, params }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    setDone(true);

    const { phone, name, email, password, childName, childAge } = params || {};

    async function finishRegistration() {
      try {
        const res = await registerUser({ name, phone, email, password, childName, childAge });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        showToast("Account created successfully!");
        navigate("dashboard");
      } catch (err) {
        showToast(err.response?.data?.message || "Registration failed. Try again.");
        navigate("register");
      }
    }

    finishRegistration();
  }, []);

  return (
    <Card>
      <Logo />
      <p className="text-center text-gray-500 text-sm mt-4">
        Creating your account...
      </p>
    </Card>
  );
}