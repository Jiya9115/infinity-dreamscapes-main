import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Menu, X, Coins } from "lucide-react";
import { toast } from "sonner";
import { assets } from "@/assets/asstes";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [credits, setCredits] = useState<number>(0);

  // Fetch and listen for live credit updates
  useEffect(() => {
    if (!user) return;

    const fetchCredits = async () => {
      const { data } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (data) setCredits(data.credits);
    };
    fetchCredits();

    const channel = supabase
      .channel('navbar-credits')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
      (payload) => setCredits(payload.new.credits))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Generate", path: "/generate" },
    { name: "Gallery", path: "/gallery" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0F172A] border-b border-slate-800 px-4 md:px-12 py-4">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LEFT SIDE: Logo */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <img src={assets.logo} alt="Logo" className="w-12 sm:w-16 h-auto rounded-xl object-contain"/>
          <span className="text-xl font-display font-bold text-white tracking-tight">
            Infinity Pixels
          </span>
        </Link>

        {/* MOBILE HAMBURGER BUTTON */}
        <button 
          className="md:hidden text-white p-2 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.path) ? "text-primary" : "text-slate-300"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && user.email === "admin@infinity.com" && (
            <Link to="/admin" className="text-sm font-medium text-purple-400 hover:text-purple-300">
              Admin Panel
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-4 ml-4 border-l border-slate-700 pl-4">
              {/* DESKTOP CREDIT COUNTER */}
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold border border-primary/20">
                <Coins className="w-3.5 h-3.5" />
                {credits} Credits
              </div>

              <span className="text-sm text-slate-300 truncate max-w-[150px]" title={user.email}>
                {user.email}
              </span>
              <button 
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0F172A] border-b border-slate-800 shadow-xl flex flex-col p-4 gap-4">
          
          {/* MOBILE CREDIT COUNTER */}
          {user && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 mb-2">
              <span className="text-sm font-medium text-primary">Your Balance</span>
              <div className="flex items-center gap-1.5 text-primary font-bold">
                <Coins className="w-4 h-4" />
                {credits} Credits
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium p-2 rounded-lg ${
                isActive(link.path) ? "bg-primary/20 text-primary" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && user.email === "admin@infinity.com" && (
            <Link 
              to="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-purple-400 p-2 rounded-lg hover:bg-slate-800"
            >
              Admin Panel
            </Link>
          )}

          {user && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-4">
              <span className="text-sm text-slate-400 px-2 truncate">
                Logged in as: {user.email}
              </span>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;