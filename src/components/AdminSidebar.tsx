import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Image, CreditCard, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Images", path: "/admin/images", icon: Image },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col h-screen p-4">
      <div className="text-xl font-bold mb-10 px-2 flex items-center gap-2 mt-14">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-xs text-white">A</div>
        <span className="text-white">Admin Panel</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? "bg-purple-600 text-white" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={() => signOut()}
        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-lg mt-auto transition-colors"
      >
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default AdminSidebar;