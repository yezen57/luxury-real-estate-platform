import { Link, useLocation } from "wouter";
import LogoWhite from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import LogoGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { cn } from "@/lib/utils";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "الوحدات السكنية", path: "/apartments" },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300",
        isDark
          ? "border-white/5 bg-black/80"
          : "border-black/10 bg-white/90 shadow-sm"
      )}
    >
      <div className="container mx-auto px-6 h-32 flex items-center justify-between gap-6">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={isDark ? LogoWhite : LogoGold}
              alt="ديار الأحلام"
              className="h-24 w-auto object-contain drop-shadow-xl transition-all duration-300"
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
                    : isDark ? "text-white/70" : "text-black/70"
                )}
              >
                {link.name}
              </div>
            </Link>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:text-primary hover:border-primary/50",
              isDark
                ? "border-white/15 text-white/70"
                : "border-black/15 text-black/70"
            )}
            aria-label="تبديل الوضع"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
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
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 hover:text-primary",
              isDark
                ? "border-white/15 text-white/70"
                : "border-black/15 text-black/70"
            )}
            aria-label="تبديل الوضع"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className={isDark ? "text-white" : "text-black"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            "md:hidden backdrop-blur-xl border-b px-4 py-6 flex flex-col gap-4 transition-all duration-300",
            isDark
              ? "bg-black/95 border-white/5"
              : "bg-white/95 border-black/10"
          )}
        >
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-semibold transition-colors hover:text-primary cursor-pointer",
                  location === link.path
                    ? "text-primary"
                    : isDark ? "text-white/70" : "text-black/70"
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
