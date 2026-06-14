export default function Btn({ children, variant = "primary", className = "", ...props }) {
  const base = "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95";
  const styles = {
    primary: "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 shadow-md shadow-orange-200",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button {...props} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}