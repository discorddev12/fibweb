import { Link } from "react-router-dom";
import fibBadge from "@/assets/fib-badge.png";

export default function Footer() {
  return (
    <footer className="border-t border-gold bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={fibBadge} alt="FIB Badge" className="h-8 w-8 object-contain opacity-60" loading="lazy" />
            <span className="text-sm text-muted-foreground">
              © 2026 FIB — Federal Investigation Bureau | Paradise State Roleplay
            </span>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/chain-of-command" className="text-sm text-muted-foreground hover:text-primary transition-colors">Chain of Command</Link>
            <Link to="/media" className="text-sm text-muted-foreground hover:text-primary transition-colors">Media</Link>
            <Link to="/join" className="text-sm text-muted-foreground hover:text-primary transition-colors">Join</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
