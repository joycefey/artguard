import { useState } from "react";
import { Wallet, Shield, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Court", path: "/court" },
  { label: "Profile", path: "/profile" },
];

export function Navbar() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={walletConnected ? "secondary" : "default"}
            size="sm"
            onClick={() => setWalletConnected(!walletConnected)}
            className="gap-2"
          >
            <Wallet className="h-4 w-4" />
            {walletConnected ? (
              <span className="font-mono text-xs">0x7F...3B</span>
            ) : (
              "Connect Wallet"
            )}
          </Button>
          <button
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
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
