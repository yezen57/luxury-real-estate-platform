import { Layout } from "@/components/layout/Layout";
import { useGetApartment, getGetApartmentQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Maximize, Share2, Info, Calendar } from "lucide-react";
import LogoIconWhite from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme";

export default function ApartmentDetail() {
  const params = useParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: apartment, isLoading, error } = useGetApartment(id, {
    query: {
      enabled: !!id,
      queryKey: getGetApartmentQueryKey(id)
    }
  });

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <Skeleton className={cn("h-[60vh] w-full rounded-3xl mb-8", isDark ? "bg-white/5" : "bg-black/5")} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className={cn("h-12 w-3/4", isDark ? "bg-white/5" : "bg-black/5")} />
              <Skeleton className={cn("h-6 w-1/2", isDark ? "bg-white/5" : "bg-black/5")} />
              <div className="flex gap-4 pt-4">
                <Skeleton className={cn("h-24 w-full", isDark ? "bg-white/5" : "bg-black/5")} />
                <Skeleton className={cn("h-24 w-full", isDark ? "bg-white/5" : "bg-black/5")} />
                <Skeleton className={cn("h-24 w-full", isDark ? "bg-white/5" : "bg-black/5")} />
              </div>
            </div>
            <div>
              <Skeleton className={cn("h-[400px] w-full rounded-2xl", isDark ? "bg-white/5" : "bg-black/5")} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !apartment) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className={cn("text-3xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>لم يتم العثور على الوحدة</h1>
          <p className={isDark ? "text-white/60 mb-8" : "text-black/60 mb-8"}>عذراً، الوحدة السكنية التي تبحث عنها غير موجودة أو تم حذفها.</p>
        </div>
      </Layout>
    );
  }

  const hasImages = apartment.images && apartment.images.length > 0;
  const images = hasImages ? apartment.images : [isDark ? LogoIconWhite : LogoIconGold];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: apartment.title,
        text: `شاهد هذه الوحدة السكنية الفاخرة من ديار الأحلام: ${apartment.title}`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`مرحباً، أود الاستفسار عن الوحدة "${apartment.title}" (رقم ${apartment.apartmentNumber}).`);
    window.open(`https://wa.me/201155018604?text=${text}`, '_blank');
  };

  return (
    <Layout>
      <div className={cn("min-h-screen pb-20 transition-colors duration-300", isDark ? "bg-black" : "bg-[#faf8f4]")}>
        {/* Image Gallery */}
        <div className={cn("w-full pt-20 transition-colors duration-300", isDark ? "bg-[#0a0a0a]" : "bg-gray-100")}>
          <div className="container mx-auto px-4 py-8">
            <div className={cn("relative h-[50vh] md:h-[65vh] w-full rounded-3xl overflow-hidden flex items-center justify-center border", isDark ? "bg-black border-white/5" : "bg-white border-black/5")}>
              {hasImages && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 dark:opacity-40 scale-105"
                  style={{ backgroundImage: `url(${images[activeImage]})` }}
                />
              )}
              <img
                src={images[activeImage]}
                alt={apartment.title}
                className={cn(
                  "relative z-10 max-w-full max-h-full object-contain transition-opacity duration-500",
                  !hasImages && "w-48 h-48 object-contain opacity-50"
                )}
              />
              <div className="absolute top-6 right-6 z-20">
                <Badge
                  variant={apartment.status === "available" ? "default" : "destructive"}
                  className={cn(
                    "text-sm px-4 py-1.5 backdrop-blur-md font-medium",
                    apartment.status === "available" ? "bg-green-600/90 text-white" : ""
                  )}
                >
                  {apartment.status === "available" ? "متاح للحجز" : "غير متاح"}
                </Badge>
              </div>
              <div className="absolute bottom-6 right-6 z-20">
                <Badge variant="outline" className={cn("backdrop-blur-md text-sm px-3 py-1 font-mono", isDark ? "bg-black/60 border-white/20 text-white" : "bg-white/80 border-black/20 text-black")}>
                  رقم الوحدة: {String(apartment.apartmentNumber).padStart(5, '0')}
                </Badge>
              </div>
            </div>

            {hasImages && images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-4 hide-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative h-24 aspect-[4/5] shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                      activeImage === idx ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main Info */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="flex items-center gap-2 text-primary mb-4 text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{apartment.city}</span>
                  <span className={isDark ? "text-white/40" : "text-black/40"}>•</span>
                  <span>{apartment.district}</span>
                </div>
                <h1 className={cn("text-3xl md:text-5xl font-bold mb-6 leading-tight", isDark ? "text-white" : "text-gray-900")}>
                  {apartment.title}
                </h1>
                <p className={cn("text-lg leading-relaxed flex items-center gap-2", isDark ? "text-white/60" : "text-black/60")}>
                  <MapPin className="w-5 h-5 shrink-0" />
                  {apartment.address}
                </p>
              </div>

              {/* Specs Grid */}
              <div className={cn("grid grid-cols-3 gap-4 border-y py-8", isDark ? "border-white/5" : "border-black/5")}>
                <div className="flex flex-col gap-2">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-primary mb-2", isDark ? "bg-white/5" : "bg-black/5")}>
                    <Bed className="w-6 h-6" />
                  </div>
                  <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{apartment.rooms}</span>
                  <span className={cn("text-sm", isDark ? "text-white/50" : "text-black/50")}>غرف نوم</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-primary mb-2", isDark ? "bg-white/5" : "bg-black/5")}>
                    <Bath className="w-6 h-6" />
                  </div>
                  <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{apartment.bathrooms}</span>
                  <span className={cn("text-sm", isDark ? "text-white/50" : "text-black/50")}>حمامات</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-primary mb-2", isDark ? "bg-white/5" : "bg-black/5")}>
                    <Maximize className="w-6 h-6" />
                  </div>
                  <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")} dir="ltr">{apartment.area} m²</span>
                  <span className={cn("text-sm", isDark ? "text-white/50" : "text-black/50")}>المساحة</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className={cn("text-2xl font-bold mb-6 flex items-center gap-3", isDark ? "text-white" : "text-gray-900")}>
                  <Info className="text-primary" />
                  الوصف والتفاصيل
                </h3>
                <div className={cn("leading-loose space-y-4", isDark ? "text-white/70" : "text-black/70")}>
                  {apartment.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Pricing & Actions */}
            <div className="lg:col-span-1">
              <div className={cn("sticky top-28 border rounded-3xl p-8 backdrop-blur-xl", isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-black/10 shadow-sm")}>
                <h3 className={cn("text-xl font-bold mb-8 border-b pb-4", isDark ? "text-white border-white/10" : "text-gray-900 border-black/10")}>أسعار التأجير</h3>

                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className={cn("mb-1 text-sm", isDark ? "text-white/60" : "text-black/60")}>الإيجار اليومي</span>
                      <span className="text-3xl font-bold text-primary">{apartment.priceDay} <span className="text-sm font-normal">ج.م</span></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className={cn("mb-1 text-sm", isDark ? "text-white/60" : "text-black/60")}>الإيجار الأسبوعي</span>
                      <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{apartment.priceWeek} <span className={cn("text-sm font-normal", isDark ? "text-white/50" : "text-black/50")}>ج.م</span></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className={cn("mb-1 text-sm", isDark ? "text-white/60" : "text-black/60")}>الإيجار الشهري</span>
                      <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{apartment.priceMonth} <span className={cn("text-sm font-normal", isDark ? "text-white/50" : "text-black/50")}>ج.م</span></span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full bg-primary text-black hover:bg-primary/90 font-bold h-14 text-lg"
                    onClick={handleWhatsApp}
                  >
                    تواصل للحجز (واتساب)
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("w-full h-14", isDark ? "border-white/10 text-white hover:bg-white/5" : "border-black/10 text-black hover:bg-black/5")}
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    مشاركة الوحدة
                  </Button>
                </div>

                <div className={cn("mt-8 pt-6 border-t text-sm flex items-center justify-center gap-2", isDark ? "border-white/10 text-white/40" : "border-black/10 text-black/40")}>
                  <Calendar className="w-4 h-4" />
                  أضيف في: {new Date(apartment.createdAt).toLocaleDateString('ar-EG')}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
