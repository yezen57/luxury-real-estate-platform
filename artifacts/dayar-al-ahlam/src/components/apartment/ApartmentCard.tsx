import { Apartment } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";

interface ApartmentCardProps {
  apartment: Apartment;
  index?: number;
}

export function ApartmentCard({ apartment, index = 0 }: ApartmentCardProps) {
  const hasImages = apartment.images && apartment.images.length > 0;
  const displayImage = hasImages ? apartment.images[0] : LogoIconGold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm transition-all hover:border-primary/50 shadow-sm dark:shadow-none"
    >
      <Link href={`/apartments/${apartment.id}`}>
        <div className="cursor-pointer block">
          <div className="relative aspect-[4/3] overflow-hidden bg-black/10 dark:bg-black/50 flex items-center justify-center">
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

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold dark:text-white text-black mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {apartment.title}
            </h3>

            <div className="flex items-center text-black/60 dark:text-white/60 text-sm mb-4">
              <MapPin size={16} className="text-primary ml-1.5" />
              <span>{apartment.city}، {apartment.district}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-black/5 dark:border-white/5 mb-4">
              <div className="flex flex-col items-center justify-center gap-1">
                <Bed size={20} className="text-primary" />
                <span className="text-sm text-black/80 dark:text-white/80">{apartment.rooms} غرف</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-x border-black/5 dark:border-white/5">
                <Bath size={20} className="text-primary" />
                <span className="text-sm text-black/80 dark:text-white/80">{apartment.bathrooms} حمامات</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <Maximize size={20} className="text-primary" />
                <span className="text-sm text-black/80 dark:text-white/80" dir="ltr">{apartment.area} m²</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-black/60 dark:text-white/60">رقم الوحدة: <span className="text-black dark:text-white font-mono font-bold">{apartment.apartmentNumber}</span></div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
