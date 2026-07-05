import { Layout } from "@/components/layout/Layout";
import { useGetApartment } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Maximize, Share2, Info, Calendar } from "lucide-react";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ApartmentDetail() {
  const params = useParams();
  const id = params.id as string;

  const { data: apartment, isLoading, error } = useGetApartment(id, {
    query: { enabled: !!id }
  });

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <Skeleton className="h-[60vh] w-full rounded-3xl bg-black/5 dark:bg-white/5 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4 bg-black/5 dark:bg-white/5" />
              <Skeleton className="h-6 w-1/2 bg-black/5 dark:bg-white/5" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-24 w-full bg-black/5 dark:bg-white/5" />
                <Skeleton className="h-24 w-full bg-black/5 dark:bg-white/5" />
                <Skeleton className="h-24 w-full bg-black/5 dark:bg-white/5" />
              </div>
            </div>
            <div>
              <Skeleton className="h-[400px] w-full rounded-2xl bg-black/5 dark:bg-white/5" />
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
          <h1 className="text-3xl dark:text-white text-black font-bold mb-4">لم يتم العثور على الوحدة</h1>
          <p className="text-black/60 dark:text-white/60 mb-8">عذراً، الوحدة السكنية التي تبحث عنها غير موجودة أو تم حذفها.</p>
        </div>
      </Layout>
    );
  }

  const hasImages = apartment.images && apartment.images.length > 0;
  const images = hasImages ? apartment.images : [LogoIconGold];

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
    window.open(`https://wa.me/201000000000?text=${text}`, '_blank');
  };

  return (
    <Layout>
      <div className="dark:bg-black bg-gray-50 min-h-screen pb-20">
        {/* Image Gallery */}
        <div className="w-full dark:bg-[#0a0a0a] bg-white pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="relative aspect-[21/9] md:aspect-[2.5/1] rounded-3xl overflow-hidden dark:bg-black bg-gray-100 flex items-center justify-center border border-black/5 dark:border-white/5">
              <img
                src={images[activeImage]}
                alt={apartment.title}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500",
                  !hasImages && "w-48 h-48 object-contain opacity-50"
                )}
              />
              <div className="absolute top-6 right-6">
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
              <div className="absolute bottom-6 right-6">
                <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/20 text-white text-sm px-3 py-1 font-mono">
                  رقم الوحدة: {apartment.apartmentNumber}
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
                      "relative h-24 w-36 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
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
                  <span className="text-black/40 dark:text-white/40">•</span>
                  <span>{apartment.district}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold dark:text-white text-black mb-6 leading-tight">
                  {apartment.title}
                </h1>
                <p className="text-black/60 dark:text-white/60 text-lg leading-relaxed flex items-center gap-2">
                  <MapPin className="w-5 h-5 shrink-0" />
                  {apartment.address}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 border-y border-black/5 dark:border-white/5 py-8">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary mb-2">
                    <Bed className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold dark:text-white text-black">{apartment.rooms}</span>
                  <span className="text-black/50 dark:text-white/50 text-sm">غرف نوم</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary mb-2">
                    <Bath className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold dark:text-white text-black">{apartment.bathrooms}</span>
                  <span className="text-black/50 dark:text-white/50 text-sm">حمامات</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary mb-2">
                    <Maximize className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold dark:text-white text-black" dir="ltr">{apartment.area} m²</span>
                  <span className="text-black/50 dark:text-white/50 text-sm">المساحة</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-2xl font-bold dark:text-white text-black mb-6 flex items-center gap-3">
                  <Info className="text-primary" />
                  الوصف والتفاصيل
                </h3>
                <div className="text-black/70 dark:text-white/70 leading-loose space-y-4">
                  {apartment.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Pricing & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-sm dark:shadow-none">
                <h3 className="text-xl font-bold dark:text-white text-black mb-8 border-b border-black/10 dark:border-white/10 pb-4">أسعار التأجير</h3>

                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-black/60 dark:text-white/60 mb-1 text-sm">الإيجار اليومي</span>
                      <span className="text-3xl font-bold text-primary">{apartment.priceDay} <span className="text-sm font-normal">ج.م</span></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-black/60 dark:text-white/60 mb-1 text-sm">الإيجار الأسبوعي</span>
                      <span className="text-2xl font-bold dark:text-white text-black">{apartment.priceWeek} <span className="text-sm font-normal text-black/50 dark:text-white/50">ج.م</span></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-black/60 dark:text-white/60 mb-1 text-sm">الإيجار الشهري</span>
                      <span className="text-2xl font-bold dark:text-white text-black">{apartment.priceMonth} <span className="text-sm font-normal text-black/50 dark:text-white/50">ج.م</span></span>
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
                    className="w-full h-14 border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    مشاركة الوحدة
                  </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 text-sm text-black/40 dark:text-white/40 flex items-center justify-center gap-2">
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
