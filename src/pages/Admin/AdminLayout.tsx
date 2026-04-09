import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "../../components/AdminSidebar";

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { navigate("/auth"); return; }
      const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
      if (data?.is_admin) setAuthorized(true);
      else navigate("/"); 
    };
    checkAdmin();
  }, [user, navigate]);

  if (authorized === null) return <div className="bg-[#0F172A] h-screen" />;

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;