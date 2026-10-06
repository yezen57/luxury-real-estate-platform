import { Apartment } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LogoIconWhite from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

interface ApartmentCardProps {
  apartment: Apartment;
  index?: number;
}

export function ApartmentCard({ apartment, index = 0 }: ApartmentCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const hasImages = apartment.images && apartment.images.length > 0;
  const displayImage = hasImages ? apartment.images[0] : (isDark ? LogoIconWhite : LogoIconGold);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all hover:border-primary/50",
        isDark
          ? "bg-white/[0.03] border-white/10"
          : "bg-white border-black/10 shadow-sm"
      )}
    >
      <Link href={`/apartments/${apartment.id}`}>
        <div className="cursor-pointer block">
          <div className={cn("relative aspect-[4/5] overflow-hidden flex items-center justify-center", isDark ? "bg-black/50" : "bg-gray-100")}>
            {hasImages ? (
              <img
                src={displayImage}
                alt={apartment.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <img
                src={displayImage}
                alt={apartment.title}
                className="w-32 h-32 object-contain opacity-50 transition-transform duration-700 group-hover:scale-110"
              />
            )}

            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Badge
                variant={apartment.status === "available" ? "default" : "destructive"}
                className={apartment.status === "available" ? "bg-green-600/90 hover:bg-green-600/90 text-white backdrop-blur-md" : "backdrop-blur-md"}
              >
                {apartment.status === "available" ? "متاح" : "غير متاح"}
              </Badge>
            </div>

            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-primary text-primary font-bold">
                {apartment.priceDay} ج.م / يوم
              </Badge>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-50"></div>
          </div>

          <div className="p-6">
            <h3 className={cn("text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors", isDark ? "text-white" : "text-gray-900")}>
              {apartment.title}
            </h3>

            <div className={cn("flex items-center text-sm mb-4", isDark ? "text-white/60" : "text-black/60")}>
              <MapPin size={16} className="text-primary ml-1.5" />
              <span>{apartment.city}، {apartment.district}</span>
            </div>

            <div className={cn("grid grid-cols-3 gap-4 py-4 border-y mb-4", isDark ? "border-white/5" : "border-black/5")}>
              <div className="flex flex-col items-center justify-center gap-1">
                <Bed size={20} className="text-primary" />
                <span className={cn("text-sm", isDark ? "text-white/80" : "text-black/80")}>{apartment.rooms} غرف</span>
              </div>
              <div className={cn("flex flex-col items-center justify-center gap-1 border-x", isDark ? "border-white/5" : "border-black/5")}>
                <Bath size={20} className="text-primary" />
                <span className={cn("text-sm", isDark ? "text-white/80" : "text-black/80")}>{apartment.bathrooms} حمامات</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <Maximize size={20} className="text-primary" />
                <span className={cn("text-sm", isDark ? "text-white/80" : "text-black/80")} dir="ltr">{apartment.area} m²</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className={cn(isDark ? "text-white/60" : "text-black/60")}>
                رقم الوحدة: <span className={cn("font-mono font-bold", isDark ? "text-white" : "text-gray-900")}>{String(apartment.apartmentNumber).padStart(5, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
