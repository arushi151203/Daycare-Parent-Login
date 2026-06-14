import {
  LayoutDashboard, Activity, Heart, Image, Video,
  MessageSquare, CreditCard, Settings, Bell,
  Utensils, Smile, Moon, Calendar,
} from "lucide-react";

export default function DashboardScreen({ navigate }) {
  const activities = [
    { icon: <Utensils size={16} className="text-orange-400" />, title: "Morning Snack", desc: "Banana slices and biscuits", time: "9:00 AM" },
    { icon: <Smile size={16} className="text-green-500" />, title: "Outdoor Play", desc: "Playing in the sandbox with friends", time: "10:30 AM" },
    { icon: <Utensils size={16} className="text-orange-400" />, title: "Lunch Time", desc: "Dal, rice, and vegetables", time: "12:00 PM" },
    { icon: <Moon size={16} className="text-blue-400" />, title: "Nap Time", desc: "Afternoon rest", time: "1:00 PM" },
  ];

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", active: true },
    { icon: <Activity size={18} />, label: "Activities" },
    { icon: <Heart size={18} />, label: "Health" },
    { icon: <Image size={18} />, label: "Gallery" },
    { icon: <Video size={18} />, label: "Live View" },
    { icon: <MessageSquare size={18} />, label: "Messages" },
    { icon: <CreditCard size={18} />, label: "Payments" },
    { icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 gap-1 shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-lg">
            🧒
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-none">LittleSteps</p>
            <p className="text-xs text-gray-400">Parent</p>
          </div>
        </div>

        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              item.active
                ? "bg-orange-400 text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-400 text-white flex items-center justify-center text-sm font-bold">
                PS
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-none">Priya Sharma</p>
                <p className="text-xs text-gray-400">Parent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Child card */}
        <div className="bg-white rounded-2xl p-5 mb-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-400 text-white text-xl font-bold flex items-center justify-center">
              AS
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Aarav Sharma</h2>
              <p className="text-sm text-gray-400">3 years 4 months</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  Toddler Group A
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Smile size={12} /> Happy
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
              <Calendar size={12} /> Check-in Today
            </p>
            <p className="text-xl font-bold text-orange-400">8:30 AM</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: <Activity size={18} className="text-gray-300" />, label: "Weight", value: "14.5 kg" },
            { icon: <Activity size={18} className="text-gray-300" />, label: "Height", value: "95 cm" },
            { icon: <Heart size={18} className="text-gray-300" />, label: "Last Checkup", value: "Mar 15" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
            >
              <span>{s.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="font-bold text-gray-800">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Activities */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Today's Activities</h3>
            <button className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    {a.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}