import { Link, useLocation } from "wouter";
import LogoFull from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "الوحدات السكنية", path: "/apartments" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={LogoFull} alt="ديار الأحلام" className="h-12 w-auto object-contain" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                  location === link.path ? "text-primary" : "text-white/70"
                )}
              >
                {link.name}
              </div>
            </Link>
          ))}
          <Link href="/apartments">
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
              احجز الآن
            </Button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/5 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary cursor-pointer",
                  location === link.path ? "text-primary" : "text-white/70"
                )}
              >
                {link.name}
              </div>
            </Link>
          ))}
          <Link href="/apartments">
            <Button
              className="w-full bg-primary text-black hover:bg-primary/90 font-bold mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              احجز الآن
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
