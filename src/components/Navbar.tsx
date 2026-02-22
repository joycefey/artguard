import { useState } from "react";
import { Wallet, Shield, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  role?: "commissioner" | "artist" | "juror";
}

const roleNavItems: Record<string, { label: string; path: string }[]> = {
  commissioner: [],
  artist: [],
  juror: [
    { label: "Court", path: "/court" },
    { label: "Profile", path: "/profile" },
  ],
};

export function Navbar({ role }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  // Always show as connected when on a dashboard page (user connected on landing)
  const walletConnected = !!role;

  const navItems = role ? roleNavItems[role] ?? [] : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold tracking-tight">
              Art<span className="text-primary">Guard</span>
            </span>
          </Link>
          {navItems.length > 0 && (
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Wallet className="h-4 w-4" />
            <span className="font-mono text-xs">0x7F...3B</span>
          </Button>
          {navItems.length > 0 && (
            <button
              className="md:hidden text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {mobileOpen && navItems.length > 0 && (
        <div className="border-t border-border p-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                location.pathname === item.path
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
