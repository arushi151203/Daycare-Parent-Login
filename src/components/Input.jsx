import { Phone, Mail, Lock, User } from "lucide-react";

const iconMap = {
  phone: Phone,
  mail: Mail,
  lock: Lock,
  user: User,
};

export default function Input({ icon, hasError, ...props }) {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <div className="relative">
      {IconComponent && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <IconComponent size={16} />
        </span>
      )}
      <input
        {...props}
        className={`w-full border rounded-xl py-3 pr-4 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 transition ${
          hasError
            ? "border-red-400 focus:ring-red-200 focus:border-red-400"
            : "border-gray-200 focus:ring-orange-300 focus:border-orange-400"
        } ${IconComponent ? "pl-9" : "pl-4"}`}
      />
    </div>
  );
}