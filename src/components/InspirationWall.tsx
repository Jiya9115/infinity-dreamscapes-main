import { motion } from "framer-motion";
import img1 from "@/assets/hero-showcase-1.jpg";
import img2 from "@/assets/hero-showcase-2.jpg";
import img3 from "@/assets/hero-showcase-3.jpg";
import img4 from "@/assets/hero-showcase-4.jpg";
import img5 from "@/assets/hero-showcase-5.jpg";
import img6 from "@/assets/hero-showcase-6.jpg";

const images = [
  { src: img1, prompt: "Cyberpunk city at night", h: "h-72" },
  { src: img2, prompt: "Cosmic galaxy dragon", h: "h-56" },
  { src: img3, prompt: "Japanese garden moonlight", h: "h-52" },
  { src: img4, prompt: "Cybernetic portrait", h: "h-72" },
  { src: img5, prompt: "Bioluminescent forest", h: "h-56" },
  { src: img6, prompt: "Floating island aurora", h: "h-52" },
];

const InspirationWall = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">
            Wall of <span className="gradient-text">Inspiration</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore what's possible with Infinity Pixels. Every image was generated from a simple text prompt.
          </p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.prompt}
                className={`w-full ${img.h} object-cover transition-transform duration-500 group-hover:scale-105`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-sm text-foreground font-medium">"{img.prompt}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InspirationWall;
