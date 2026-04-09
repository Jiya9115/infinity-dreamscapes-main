import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });
        
      if (data) setPayments(data);
      if (error) console.error("Error fetching payments:", error);
    };
    fetchPayments();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 mt-14">Payments</h1>
      <div className="bg-slate-900 rounded-xl border border-slate-800">
        <table className="w-full text-left">
          <thead className="border-b border-slate-800 text-slate-400 text-sm">
            <tr>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Plan</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                <td className="p-4 text-sm text-slate-300">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 font-medium">{p.profiles?.email}</td>
                <td className="p-4 uppercase text-xs font-bold text-purple-400">
                  {p.plan}
                </td>
                <td className="p-4 uppercase text-xs font-bold text-blue-400">
                  {p.status}
                </td>
                <td className="p-4 text-right font-bold text-green-400">
                  ${(p.amount / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;