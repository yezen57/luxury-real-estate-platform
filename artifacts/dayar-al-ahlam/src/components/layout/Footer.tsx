import { Link } from "wouter";
import LogoWhite from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import LogoGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { useTheme } from "@/contexts/theme";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className={cn(
      "border-t pt-16 pb-8 transition-colors duration-300",
      isDark ? "border-white/5 bg-black" : "border-black/10 bg-[#faf8f4]"
    )}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="flex flex-col gap-6">
          <Link href="/">
            <img
              src={isDark ? LogoWhite : LogoGold}
              alt="ديار الأحلام"
              className="h-16 w-auto object-contain cursor-pointer transition-all duration-300"
            />
          </Link>
          <p className={cn("leading-relaxed max-w-sm", isDark ? "text-white/60" : "text-black/60")}>
            نقدم لكم تجربة استثمار عقاري فاخرة تجمع بين الأناقة والراحة، بمواصفات تحاكي الفنادق ذات الخمس نجوم.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://wa.me/201155018604"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                "hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-500/5 hover:scale-110",
                isDark ? "border-white/10 text-white/60 bg-white/[0.02]" : "border-black/10 text-black/60 bg-black/[0.02]"
              )}
              title="واتساب"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/dayar_al_ahlam"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                "hover:text-pink-500 hover:border-pink-500 hover:bg-pink-500/5 hover:scale-110",
                isDark ? "border-white/10 text-white/60 bg-white/[0.02]" : "border-black/10 text-black/60 bg-black/[0.02]"
              )}
              title="انستقرام"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/dayar_al_ahlam"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                "hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/5 hover:scale-110",
                isDark ? "border-white/10 text-white/60 bg-white/[0.02]" : "border-black/10 text-black/60 bg-black/[0.02]"
              )}
              title="فيسبوك"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-primary mb-6">روابط سريعة</h3>
          <ul className="flex flex-col gap-4">
            <li>
              <Link href="/">
                <div className={cn("hover:text-primary transition-colors cursor-pointer", isDark ? "text-white/60" : "text-black/60")}>الرئيسية</div>
              </Link>
            </li>
            <li>
              <Link href="/apartments">
                <div className={cn("hover:text-primary transition-colors cursor-pointer", isDark ? "text-white/60" : "text-black/60")}>الوحدات السكنية</div>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-primary mb-6">تواصل معنا</h3>
          <ul className="flex flex-col gap-4">
            <li className={cn("flex items-start gap-3", isDark ? "text-white/60" : "text-black/60")}>
              <Phone className="text-primary w-5 h-5 shrink-0 mt-1" />
              <div className="flex flex-col gap-1">
                <a href="tel:+201155018604" className="hover:text-primary transition-colors font-mono" dir="ltr">+201155018604</a>
                <a href="tel:+201156599007" className="hover:text-primary transition-colors font-mono" dir="ltr">+201156599007</a>
              </div>
            </li>
            <li className={cn("flex items-center gap-3", isDark ? "text-white/60" : "text-black/60")}>
              <Mail className="text-primary w-5 h-5 shrink-0" />
              <a href="mailto:dayaralahlam@gmail.com" className="hover:text-primary transition-colors font-mono">dayaralahlam@gmail.com</a>
            </li>
            <li className={cn("flex items-start gap-3", isDark ? "text-white/60" : "text-black/60")}>
              <MapPin className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <span>مصر - الجيزة - جوار مستشفى العشرين</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={cn(
        "container mx-auto px-4 border-t pt-8 text-center text-sm transition-colors duration-300",
        isDark ? "border-white/5 text-white/40" : "border-black/10 text-black/40"
      )}>
        جميع الحقوق محفوظة © {new Date().getFullYear()} ديار الأحلام.
      </div>
    </footer>
  );
}
