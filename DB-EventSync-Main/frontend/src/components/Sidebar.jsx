import { LayoutDashboard, Ticket, User, LogOut } from "lucide-react";

export default function Sidebar({ active, onSelect, onLogout }) {
  const menu = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "tickets", label: "My Tickets", icon: Ticket },
    { key: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400 tracking-wide">
          EventSync
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menu.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => onSelect(m.key)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition ${
                active === m.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon size={18} />
              {m.label}
            </button>
          );
        })}
      </div>

      
    </div>
  );
}
