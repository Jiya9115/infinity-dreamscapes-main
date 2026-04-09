import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "$10",
    description: "Perfect for trying out",
    features: ["50 Credits", "Standard quality", "Community support"],
    cta: "Purchase",
    popular: false,
  },
  {
    name: "Advanced",
    price: "$50",
    description: "For serious creators",
    features: ["500 Credits", "4K resolution", "All style presets", "Priority support", "Batch generation", "API access"],
    cta: "Purchase",
    popular: true,
  },
  {
    name: "Business",
    price: "$250",
    description: "For teams & businesses",
    features: ["1000 Credits", "Max resolution", "Custom models", "Dedicated support", "Team workspace", "SLA guarantee"],
    cta: "Purchase",
    popular: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Best For Individuals & Teams. Scale as you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-6 flex flex-col ${
                plan.popular
                  ? "glass border-primary/40 glow-primary relative"
                  : "glass"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-display font-semibold text-lg">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="font-display font-extrabold text-4xl">{plan.price}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              
              
              <Button 
                variant={plan.popular ? "glow" : "glass"} 
                className="w-full"
                onClick={() => navigate('/pricing')}
              >
                {plan.cta}
              </Button>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;