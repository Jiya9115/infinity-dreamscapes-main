import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    navigate("/generate", { state: { prompt } });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI-Powered Image Generation
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
          Turn Words Into{" "}
          <span className="gradient-text">Infinite Art</span>
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto">
          Create stunning, photorealistic images from simple text descriptions.
          Powered by cutting-edge AI models.
        </p>
      </motion.div>

      {/* Glassmorphism prompt bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="glass rounded-2xl p-2 glow-primary">
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Describe the image you want to create..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm"
            />
            <Button
              variant="glow"
              size="lg"
              onClick={handleGenerate}
              className="rounded-xl gap-2"
            >
              Generate
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-center text-muted-foreground text-xs mt-3">
          Try: "A cosmic whale swimming through nebula clouds" or "Cyberpunk samurai in neon rain"
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
