export default function MethodToggle({ method, setMethod }) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
      {["OTP Login", "Password"].map((m) => (
        <button
          key={m}
          onClick={() => setMethod(m)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            method === m
              ? "bg-white shadow text-gray-800"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}