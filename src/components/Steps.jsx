export default function Steps({ current }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              s < current
                ? "bg-orange-400 text-white"
                : s === current
                ? "bg-orange-400 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {s < current ? "✓" : s}
          </div>
          {i < 2 && (
            <div className={`w-16 h-0.5 ${s < current ? "bg-orange-400" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}