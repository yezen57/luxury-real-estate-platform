import { Layout } from "@/components/layout/Layout";
import { useGetStats, useGetCityStats, useListApartments } from "@workspace/api-client-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import LogoIconWhite from "@assets/ديار_بدون_خلفيه-03_1783264617965.png";
import { ApartmentCard } from "@/components/apartment/ApartmentCard";
import { Building2, Key, Star, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
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
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-60"></div>
          {/* Decorative noise/texture could go here */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <img src={LogoIconGold} alt="Icon" className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_15px_rgba(210,173,38,0.5)]" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            نصنع معايير <span className="text-primary">الرفاهية</span>
            <br />في الاستثمار العقاري
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
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

        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[30%] opacity-20 hidden lg:block"
        >
          <img src={LogoIconWhite} alt="" className="w-24 h-24 blur-[2px]" />
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
      <section className="py-20 border-y border-white/5 relative bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {isLoadingStats ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-2xl" />
              ))
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{stats?.total || 0}</span>
                  <span className="text-white/60">إجمالي الوحدات</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{stats?.available || 0}</span>
                  <span className="text-white/60">وحدات متاحة</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{stats?.cities || 0}</span>
                  <span className="text-white/60">مدن التغطية</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</span>
                  <span className="text-white/60">رضا العملاء</span>
                </motion.div>
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
                className="text-3xl md:text-5xl font-bold text-white mb-4"
              >
                وحدات <span className="text-primary">مميزة</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-white/60 text-lg max-w-xl"
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
                <Skeleton key={i} className="h-[450px] w-full rounded-2xl bg-white/5" />
              ))
            ) : featured?.data?.length ? (
              featured.data.map((apt, index) => (
                <ApartmentCard key={apt.id} apartment={apt} index={index} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-white/50">
                لا توجد وحدات متاحة حالياً.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About/Features */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              لماذا <span className="text-primary">ديار الأحلام</span>؟
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              نحن لا نقدم مجرد شقق، بل أسلوب حياة متكامل يجمع بين الفخامة والأمان والموقع الاستراتيجي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Star className="w-10 h-10" />, title: "جودة فندقية", desc: "تشطيبات فاخرة وتصاميم عصرية تنافس أرقى الفنادق" },
              { icon: <ShieldCheck className="w-10 h-10" />, title: "أمان وموثوقية", desc: "أنظمة حماية ذكية وصيانة دورية لضمان راحتك" },
              { icon: <Building2 className="w-10 h-10" />, title: "مواقع استراتيجية", desc: "انتقاء أفضل الأحياء وأكثرها حيوية في المدن" },
              { icon: <Key className="w-10 h-10" />, title: "دخول ذكي", desc: "أنظمة دخول ذكية وسهولة في الحجز والاستلام" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-black border border-white/5 hover:border-primary/30 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-8"
          >
            هل أنت مستعد لتجربة السكن <span className="text-primary">الفاخر</span>؟
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
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
