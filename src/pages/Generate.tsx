import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import GenerateSidebar from "@/components/generate/GenerateSidebar";
import Footer from "@/components/Footer";

const stylePresets = ["Photorealistic", "Anime", "Oil Painting", "Digital Art", "Watercolor", "3D Render", "Pixel Art", "Cinematic"];
const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:2"];

const Generate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const initialPrompt = (location.state as { prompt?: string })?.prompt || "";
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [negativePrompt, setNegativePrompt] = useState("");
  
  // State for credits
  const [credits, setCredits] = useState<number>(0);

  // Real-time Credit Listener
  useEffect(() => {
    if (!user) return;

    // Fetch initial credits on load
    const fetchCredits = async () => {
      const { data } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (data) setCredits(data.credits);
    };
    fetchCredits();

    // Listen for live database updates (e.g., when they buy more via Stripe)
    const channel = supabase
      .channel('live-credits')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
      (payload) => setCredits(payload.new.credits))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!user) {
      toast.error("Please sign in to generate images");
      navigate("/auth");
      return;
    }

    // Credit Guard - Stop generation if out of credits
    if (credits <= 0) {
      toast.error("Out of credits!", { description: "Please upgrade your plan to continue creating." });
      navigate("/pricing");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // 1. Call Hugging Face Edge Function
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: prompt.trim(),
          style: selectedStyle,
          aspect_ratio: selectedRatio,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setGeneratedImage(data.image_url);
      toast.success("Image generated successfully!");

      // 2. Save image to the secure database vault
      const { error: dbError } = await supabase
        .from('generated_images') // FIXED: Now points to the correct table!
        .insert({
          user_id: user.id,
          prompt: prompt.trim(), 
          image_url: data.image_url, 
        });
        
      if (dbError) {
        console.error("Failed to save image to history:", dbError);
        toast.error("Image created, but failed to save to gallery.");
      }

      // 3. Deduct 1 credit securely
      const { error: creditError } = await supabase.rpc("deduct_one_credit", {
        target_user_id: user.id
      });

      if (creditError) {
        console.error("Credit deduction error:", creditError);
      } else {
        // Optimistically update the UI so it feels instant
        setCredits((prev) => prev - 1); 
      }

    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `infinity-pixels-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 flex flex-col lg:flex-row flex-1">
        <GenerateSidebar
          stylePresets={stylePresets}
          aspectRatios={aspectRatios}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedRatio={selectedRatio}
          setSelectedRatio={setSelectedRatio}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
        />

        <main className="flex-1 flex flex-col p-6">
          {/* Credit Display Badge */}
          <div className="flex justify-end mb-2">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/20">
              {credits} Credits Available
            </div>
          </div>

          <div className="glass rounded-xl p-2 mb-6">
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
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || credits <= 0}
                className="gap-2 rounded-xl"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {isGenerating ? (
              <div className="w-full max-w-lg aspect-square rounded-2xl shimmer" />
            ) : generatedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="max-h-[60vh] rounded-2xl object-contain"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="glass" size="sm" className="gap-1.5" onClick={handleDownload}>
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>
                  <Button variant="glass" size="sm" onClick={handleGenerate} className="gap-1.5" disabled={credits <= 0}>
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Enter a prompt and click Generate to create your image</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Generate;