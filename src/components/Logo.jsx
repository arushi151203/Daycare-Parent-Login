export default function Logo({ size = "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xl" : "w-12 h-12 text-2xl";
  const txt = size === "sm" ? "text-xl" : "text-2xl";

  return (
    <div className="flex items-center gap-2 justify-center mb-1">
      <div className={`${sz} rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md`}>
        <span>🧒</span>
      </div>
      <span className={`${txt} font-bold text-gray-800`}>LittleSteps</span>
    </div>
  );
}