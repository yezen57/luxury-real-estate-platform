import { Link } from "wouter";
import LogoFull from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="flex flex-col gap-6">
          <Link href="/">
            <img src={LogoFull} alt="ديار الأحلام" className="h-16 w-auto object-contain cursor-pointer" />
          </Link>
          <p className="text-white/60 leading-relaxed max-w-sm">
            نقدم لكم تجربة استثمار عقاري فاخرة تجمع بين الأناقة والراحة، بمواصفات تحاكي الفنادق ذات الخمس نجوم.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-primary mb-6">روابط سريعة</h3>
          <ul className="flex flex-col gap-4">
            <li>
              <Link href="/">
                <div className="text-white/60 hover:text-primary transition-colors cursor-pointer">الرئيسية</div>
              </Link>
            </li>
            <li>
              <Link href="/apartments">
                <div className="text-white/60 hover:text-primary transition-colors cursor-pointer">الوحدات السكنية</div>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-primary mb-6">تواصل معنا</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3 text-white/60">
              <Phone className="text-primary w-5 h-5" />
              <span dir="ltr">+966 50 000 0000</span>
            </li>
            <li className="flex items-center gap-3 text-white/60">
              <Mail className="text-primary w-5 h-5" />
              <span>info@dayar-alahlam.com</span>
            </li>
            <li className="flex items-center gap-3 text-white/60">
              <MapPin className="text-primary w-5 h-5" />
              <span>الرياض، المملكة العربية السعودية</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 border-t border-white/5 pt-8 text-center text-sm text-white/40">
        جميع الحقوق محفوظة © {new Date().getFullYear()} ديار الأحلام.
      </div>
    </footer>
  );
}
