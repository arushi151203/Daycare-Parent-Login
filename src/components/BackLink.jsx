export default function BackLink({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
    >
      ← {label}
    </button>
  );
}