import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Zap, Star, Crown } from "lucide-react";
import Footer from "@/components/Footer";

// Define your three plans here
const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "Best for personal use.",
    price: 10,
    credits: 100,
    icon: Zap,
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Best for business use.",
    price: 50,
    credits: 500,
    icon: Star,
  },
  {
    id: "business",
    name: "Business",
    description: "Best for enterprise use.",
    price: 250,
    credits: 5000,
    icon: Crown,
  }
];

const Pricing = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (planId: string) => {
    if (!user) {
      toast.error("Please sign in to purchase credits.");
      navigate("/auth");
      return;
    }

    try {
      setLoadingId(planId);
      
      // Notice we are now sending the chosen planId to the Edge Function!
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: planId } 
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to initiate checkout.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white py-20 px-4 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center mb-16 mt-8">
        <span className="border border-slate-700 rounded-full px-6 py-2 text-sm text-slate-300 tracking-wide">
          Our Plans
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mt-8">Choose the plan</h2>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col hover:border-purple-500/50 transition-colors duration-300"
          >
            <div className="bg-blue-600/20 w-14 h-14 rounded-xl flex items-center justify-center text-blue-500 mb-6">
              <plan.icon size={28} />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-slate-400 text-sm mb-8">{plan.description}</p>
            
            <div className="mb-8">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-slate-400 text-sm ml-2">/ {plan.credits} credits</span>
            </div>

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingId !== null}
              className="mt-auto w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex justify-center items-center"
            >
              {loadingId === plan.id ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Purchase"
              )}
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;