export default function Card({ children, wide = false }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-green-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-3xl shadow-xl p-8 w-full ${wide ? "max-w-lg" : "max-w-sm"}`}>
        {children}
      </div>
    </div>
  );
}