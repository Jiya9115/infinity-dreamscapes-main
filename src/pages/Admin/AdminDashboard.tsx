import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, CreditCard, ImageIcon, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, payments: 0, revenue: 0, images: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: userCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
      const { count: imageCount } = await supabase.from("generated_images").select("*", { count: 'exact', head: true });
      const { data: paymentData } = await supabase.from("payments").select("amount");
      
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (curr.amount / 100), 0) || 0;

      setStats({
        users: userCount || 0,
        images: imageCount || 0,
        payments: paymentData?.length || 0,
        revenue: totalRevenue
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.users, icon: Users, color: "text-blue-400" },
    { title: "Images Created", value: stats.images, icon: ImageIcon, color: "text-purple-400" },
    { title: "Payments", value: stats.payments, icon: CreditCard, color: "text-pink-400" },
    { title: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "text-green-400" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 mt-14">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className={`mb-4 ${card.color}`}><card.icon size={28} /></div>
            <div className="text-slate-400 text-sm font-medium">{card.title}</div>
            <div className="text-2xl font-bold mt-1 text-white">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;