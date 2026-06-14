export default function RoleTabs({ role, setRole }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="text-sm text-gray-500 shrink-0">I am a</span>
      <div className="flex gap-2">
        {["Parent", "Staff", "Admin"].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              role === r
                ? "bg-orange-400 text-white shadow-md shadow-orange-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}