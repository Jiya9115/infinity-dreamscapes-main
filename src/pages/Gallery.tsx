import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Heart, MoreHorizontal } from "lucide-react";

import img1 from "@/assets/hero-showcase-1.jpg";
import img2 from "@/assets/hero-showcase-2.jpg";
import img3 from "@/assets/hero-showcase-3.jpg";
import img4 from "@/assets/hero-showcase-4.jpg";
import img5 from "@/assets/hero-showcase-5.jpg";
import img6 from "@/assets/hero-showcase-6.jpg";

const galleryItems = [
  { src: img1, prompt: "Cyberpunk city at night with neon reflections", style: "Cinematic", date: "Mar 12, 2026", h: "h-72" },
  { src: img2, prompt: "Cosmic galaxy dragon in deep space", style: "Digital Art", date: "Mar 11, 2026", h: "h-56" },
  { src: img3, prompt: "Japanese cherry blossom garden moonlight", style: "Watercolor", date: "Mar 10, 2026", h: "h-52" },
  { src: img4, prompt: "Cybernetic woman portrait with circuit patterns", style: "Photorealistic", date: "Mar 9, 2026", h: "h-72" },
  { src: img5, prompt: "Bioluminescent enchanted forest path", style: "Fantasy", date: "Mar 8, 2026", h: "h-56" },
  { src: img6, prompt: "Floating island with aurora borealis", style: "Digital Art", date: "Mar 7, 2026", h: "h-52" },
];

const Gallery = () => {
  // 1. State to track which images are liked (using the array index as the ID for now)
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});

  // 2. Download Function
  const handleDownload = (src: string, prompt: string) => {
    // Create a temporary link
    const link = document.createElement("a");
    link.href = src;
    // Create a safe filename from the first 20 characters of the prompt
    const safeName = prompt.slice(0, 20).replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.download = `infinity_pixels_${safeName}.jpg`;
    
    // Append, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Toggle Like Function
  const toggleLike = (index: number) => {
    setLikedItems((prev) => ({
      ...prev,
      [index]: !prev[index], // Flip between true and false
    }));
  };

  // 4. Copy Prompt Function
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    // You can replace this with a fancy toast notification if you have one!
    alert(`Copied to clipboard!\n"${prompt}"`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Added flex-1 to push the footer to the bottom */}
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">
              Your <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-muted-foreground">All your generated masterpieces in one place.</p>
          </motion.div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="break-inside-avoid glass rounded-xl overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={item.src}
                    alt={item.prompt}
                    className={`w-full ${item.h} object-cover`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 gap-2">
                    
                    {/* DOWNLOAD BUTTON */}
                    <button 
                      onClick={() => handleDownload(item.src, item.prompt)}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-primary/20 hover:text-white transition-colors"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {/* LIKE BUTTON */}
                    <button 
                      onClick={() => toggleLike(i)}
                      className={`w-8 h-8 rounded-lg glass flex items-center justify-center transition-colors ${
                        likedItems[i] 
                          ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                          : "hover:bg-primary/20 hover:text-white"
                      }`}
                      title={likedItems[i] ? "Unlike" : "Like"}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        fill={likedItems[i] ? "currentColor" : "none"} 
                      />
                    </button>
                    
                    {/* MORE/COPY BUTTON */}
                    <button 
                      onClick={() => handleCopyPrompt(item.prompt)}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-primary/20 hover:text-white transition-colors ml-auto"
                      title="Copy Prompt"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-foreground font-medium line-clamp-1">"{item.prompt}"</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.style}</span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;