import { Link, useLocation } from "wouter";
import LogoFull from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import { cn } from "@/lib/utils";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "الوحدات السكنية", path: "/apartments" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/5 bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-sm dark:shadow-none">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between gap-6">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={LogoFull}
              alt="ديار الأحلام"
              className="h-16 w-auto object-contain drop-shadow-sm"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div
                className={cn(
                  "text-base font-semibold transition-colors hover:text-primary cursor-pointer",
                  location === link.path
                    ? "text-primary"
                    : "text-black/70 dark:text-white/70"
                )}
              >
                {link.name}
              </div>
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:text-primary hover:border-primary/50 transition-colors"
            aria-label="تبديل الوضع"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/apartments">
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold px-6">
              احجز الآن
            </Button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:text-primary transition-colors"
            aria-label="تبديل الوضع"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-black/10 dark:border-white/5 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-semibold transition-colors hover:text-primary cursor-pointer",
                  location === link.path
                    ? "text-primary"
                    : "text-black/70 dark:text-white/70"
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
