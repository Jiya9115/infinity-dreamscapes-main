import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {assets} from "@/assets/asstes";
import { LogOut, ShieldCheck, User } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ credits: number; is_admin: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("credits, is_admin")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
    };

    fetchProfile();

    // Listener to update credits/admin status in real-time
    const channel = supabase
      .channel("profile_updates")
      .on("postgres_changes", { 
        event: "UPDATE", 
        schema: "public", 
        table: "profiles",
        filter: `id=eq.${user.id}` 
      }, 
      (payload) => setProfile(payload.new as any))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // NEW: Helper function to handle sign out and redirection
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0F172A] border-b border-slate-800 px-8 py-4 flex justify-between items-center">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
       <img src={assets.logo} alt="" className ="w-15 h-10 rounded-xl flex item-center justify-center"/>
        <span className="text-xl font-bold text-white">Infinity Pixels</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-slate-400 hover:text-white transition text-sm font-medium">Home</Link>
        <Link to="/generate" className="text-slate-400 hover:text-white transition text-sm font-medium">Generate</Link>
        <Link to="/gallery" className="text-slate-400 hover:text-white transition text-sm font-medium">Gallery</Link>
        <Link to="/pricing" className="text-slate-400 hover:text-white transition text-sm font-medium">Pricing</Link>
        
        {/* Admin Access */}
        {profile?.is_admin && (
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition text-sm font-bold uppercase tracking-wider"
          >
            <ShieldCheck size={16} /> Admin Panel
          </Link>
        )}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* Credit Display */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Balance</span>
              <span className="text-purple-400 font-bold leading-none">{profile?.credits ?? 0} Credits</span>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300 hidden md:block">{user.email}</span>
              
              {/* UPDATED: Calling the new handleSignOut function */}
              <button 
                onClick={handleSignOut} 
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-slate-300 hover:text-white text-sm font-medium">
              Sign In
            </Link>
            <Link 
              to="/auth" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow-lg shadow-purple-900/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;