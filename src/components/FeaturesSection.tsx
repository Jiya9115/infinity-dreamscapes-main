import { motion } from "framer-motion";
import { Zap, Image, Shield, Layers, Wand2, Download } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate high-quality images in seconds with our optimized AI pipeline.",
  },
  {
    icon: Image,
    title: "4K Resolution",
    description: "Output stunning images up to 4096×4096 pixels for print-ready quality.",
  },
  {
    icon: Wand2,
    title: "Style Presets",
    description: "Choose from 50+ curated styles — photorealistic, anime, oil painting, and more.",
  },
  {
    icon: Layers,
    title: "Batch Generation",
    description: "Generate multiple variations at once and pick your favorite.",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description: "Your prompts and images are encrypted and never shared.",
  },
  {
    icon: Download,
    title: "Easy Export",
    description: "Download in PNG, JPG, or WebP. Upscale with one click.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Everything you need to bring your imagination to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
