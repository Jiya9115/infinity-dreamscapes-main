import { Settings2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GenerateSidebarProps {
  stylePresets: string[];
  aspectRatios: string[];
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  selectedRatio: string;
  setSelectedRatio: (r: string) => void;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
  negativePrompt: string;
  setNegativePrompt: (v: string) => void;
}

const GenerateSidebar = ({
  stylePresets,
  aspectRatios,
  selectedStyle,
  setSelectedStyle,
  selectedRatio,
  setSelectedRatio,
  showAdvanced,
  setShowAdvanced,
  negativePrompt,
  setNegativePrompt,
}: GenerateSidebarProps) => {
  return (
    <aside className="w-full lg:w-80 border-r border-border/30 p-6 flex flex-col gap-6 shrink-0">
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Style Preset
        </label>
        <div className="flex flex-wrap gap-2">
          {stylePresets.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStyle(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedStyle === s
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Aspect Ratio
        </label>
        <div className="flex gap-2">
          {aspectRatios.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRatio(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedRatio === r
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings2 className="w-4 h-4" />
        Advanced Settings
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Negative Prompt
              </label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Things to avoid..."
                className="w-full bg-card border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none h-20"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Quality
              </label>
              <input
                type="range"
                min="1"
                max="100"
                defaultValue="80"
                className="w-full accent-primary"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">AI Powered</span>
          <span className="text-sm font-semibold text-accent">Ready</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Images are generated using real AI models
        </p>
      </div>
    </aside>
  );
};

export default GenerateSidebar;
