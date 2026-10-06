import { Layout } from "@/components/layout/Layout";
import { useGetStats, useGetCityStats, useListApartments } from "@workspace/api-client-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LogoIconWhite from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { ApartmentCard } from "@/components/apartment/ApartmentCard";
import { Building2, Key, Star, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: stats, isLoading: isLoadingStats } = useGetStats();
  const { data: cityStats, isLoading: isLoadingCityStats } = useGetCityStats();
  const { data: featured, isLoading: isLoadingFeatured } = useListApartments({ limit: 6 });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <Layout>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={cn("relative min-h-[90vh] flex items-center justify-center overflow-hidden transition-colors duration-300",
          isDark ? "bg-black" : "bg-[#faf8f4]"
        )}
      >
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className={cn(
            "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] opacity-60",
            isDark
              ? "from-primary/20 via-black to-black"
              : "from-primary/15 via-[#faf8f4] to-[#faf8f4]"
          )}></div>
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <img
              src={isDark ? LogoIconWhite : LogoIconGold}
              alt="ديار الأحلام"
              className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_20px_rgba(180,140,20,0.25)]"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={cn("text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            نصنع معايير <span className="text-primary">الرفاهية</span>
            <br />في الاستثمار العقاري
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={cn("text-lg md:text-xl max-w-2xl mb-10 leading-relaxed",
              isDark ? "text-white/70" : "text-gray-600"
            )}
          >
            اكتشف مجموعة حصرية من الشقق الفاخرة المصممة خصيصاً لتمنحك تجربة سكن فندقية راقية بخدمات استثنائية.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/apartments">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-lg px-10 py-6 h-auto font-bold rounded-full shadow-[0_0_20px_rgba(210,173,38,0.3)] hover:shadow-[0_0_30px_rgba(210,173,38,0.5)] transition-all">
                استعرض العقارات
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[30%] opacity-10 hidden lg:block"
        >
          <img src={isDark ? LogoIconWhite : LogoIconGold} alt="" className="w-24 h-24 blur-[2px]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[10%] bottom-[30%] opacity-10 hidden lg:block"
        >
          <img src={LogoIconGold} alt="" className="w-32 h-32 blur-[4px]" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={cn(
        "py-20 border-y transition-colors duration-300",
        isDark ? "border-white/5 bg-white/[0.02]" : "border-black/5 bg-black/[0.02]"
      )}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {isLoadingStats ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className={cn("h-32 w-full rounded-2xl", isDark ? "bg-white/5" : "bg-black/5")} />
              ))
            ) : (
              <>
                {[
                  { value: stats?.total || 0, label: "إجمالي الوحدات" },
                  { value: stats?.available || 0, label: "وحدات متاحة" },
                  { value: stats?.cities || 0, label: "مدن التغطية" },
                  { value: "10+", label: "سنوات خبرة" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center justify-center p-6 text-center"
                  >
                    <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</span>
                    <span className={isDark ? "text-white/60" : "text-black/60"}>{stat.label}</span>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={cn("text-3xl md:text-5xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}
              >
                وحدات <span className="text-primary">مميزة</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={cn("text-lg max-w-xl", isDark ? "text-white/60" : "text-black/60")}
              >
                تصفح أحدث الوحدات السكنية المضافة إلى محفظتنا العقارية، مختارة بعناية لتناسب ذوقك الرفيع.
              </motion.p>
            </div>
            <Link href="/apartments">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                عرض الكل
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingFeatured ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className={cn("h-[450px] w-full rounded-2xl", isDark ? "bg-white/5" : "bg-black/5")} />
              ))
            ) : featured?.data?.length ? (
              featured.data.map((apt, index) => (
                <ApartmentCard key={apt.id} apartment={apt} index={index} />
              ))
            ) : (
              <div className={cn("col-span-full py-20 text-center", isDark ? "text-white/50" : "text-black/50")}>
                لا توجد وحدات متاحة حالياً.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={cn(
        "py-32 border-y relative overflow-hidden transition-colors duration-300",
        isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"
      )}>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className={cn("text-3xl md:text-5xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
              لماذا <span className="text-primary">ديار الأحلام</span>؟
            </h2>
            <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-white/60" : "text-black/60")}>
              نحن لا نقدم مجرد شقق، بل أسلوب حياة متكامل يجمع بين الفخامة والأمان والموقع الاستراتيجي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Star className="w-10 h-10" />, title: "جودة فندقية", desc: "تشطيبات فاخرة وتصاميم عصرية تنافس أرقى الفنادق" },
              { icon: <ShieldCheck className="w-10 h-10" />, title: "أمان وموثوقية", desc: "أنظمة حماية ذكية وصيانة دورية لضمان راحتك" },
              { icon: <Building2 className="w-10 h-10" />, title: "مواقع استراتيجية", desc: "انتقاء أفضل الأحياء وأكثرها حيوية في المدن" },
              { icon: <Key className="w-10 h-10" />, title: "دخول ذكي", desc: "أنظمة دخول ذكية وسهولة في الحجز والاستلام" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-8 rounded-2xl border transition-colors group",
                  isDark
                    ? "bg-white/[0.03] border-white/5 hover:border-primary/30"
                    : "bg-white border-black/5 hover:border-primary/30 shadow-sm"
                )}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-gray-900")}>{feature.title}</h3>
                <p className={cn("leading-relaxed", isDark ? "text-white/60" : "text-black/60")}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Coverage */}
      <section className={cn(
        "py-32 relative overflow-hidden transition-colors duration-300",
        isDark ? "bg-black" : "bg-[#faf8f4]"
      )}>
        <div className="absolute inset-0 bg-primary/5"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn("text-3xl md:text-5xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}
            >
              تغطيتنا <span className="text-primary">الجغرافية</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-white/60" : "text-black/60")}
            >
              نفخر بتواجدنا في أبرز المدن المصرية، لنقدم لك أفضل الخيارات العقارية أينما كنت.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoadingCityStats ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className={cn("h-32 w-full rounded-2xl", isDark ? "bg-white/5" : "bg-black/5")} />
              ))
            ) : cityStats?.length ? (
              cityStats.map((cityStat, idx) => (
                <motion.div
                  key={cityStat.city}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={cn(
                    "relative group border hover:border-primary/40 rounded-2xl p-6 text-center transition-all duration-300",
                    isDark ? "bg-white/[0.03] border-white/10" : "bg-white/80 border-black/10"
                  )}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>{cityStat.city}</h3>
                  <p className="text-primary text-2xl font-bold">{cityStat.count}</p>
                  <p className={cn("text-sm", isDark ? "text-white/50" : "text-black/50")}>وحدة سكنية</p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className={isDark ? "text-white/50" : "text-black/50"}>لا توجد بيانات حالياً</p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link href="/apartments">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-lg px-12 py-8 h-auto font-bold rounded-full">
                تصفح الوحدات الآن
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
