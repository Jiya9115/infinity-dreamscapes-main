import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/30 py-12 px-4">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-foreground">Infinity Pixels</span>
      </Link>
      <p className="text-xs text-muted-foreground">© 2026 Infinity Pixels. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
