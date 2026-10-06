import { Layout } from "@/components/layout/Layout";
import { useListApartments, ListApartmentsStatus, ListApartmentsSortBy } from "@workspace/api-client-react";
import { ApartmentCard } from "@/components/apartment/ApartmentCard";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

export default function Apartments() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [city, setCity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date_desc");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListApartments({
    page,
    limit: 12,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(city !== "all" ? { city } : {}),
    ...(status !== "all" ? { status: status as ListApartmentsStatus } : {}),
    ...(sortBy ? { sortBy: sortBy as ListApartmentsSortBy } : {}),
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, city, status, sortBy]);

  const inputClass = cn(
    "border h-12",
    isDark ? "bg-black/50 border-white/10 text-white" : "bg-white border-black/10 text-black"
  );
  const selectTriggerClass = cn(
    "h-12 border",
    isDark ? "bg-black/50 border-white/10 text-white" : "bg-white border-black/10 text-black"
  );
  const selectContentClass = cn(
    "border",
    isDark ? "bg-gray-900 border-white/10 text-white" : "bg-white border-black/10 text-black"
  );

  return (
    <Layout>
      <div className={cn("border-b pt-28 pb-12 transition-colors duration-300", isDark ? "bg-black border-white/5" : "bg-[#faf8f4] border-black/5")}>
        <div className="container mx-auto px-4">
          <h1 className={cn("text-4xl md:text-5xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
            الوحدات <span className="text-primary">السكنية</span>
          </h1>
          <p className={cn("text-lg max-w-2xl mb-10", isDark ? "text-white/60" : "text-black/60")}>
            تصفح مجموعتنا الحصرية من الشقق الفاخرة، واختر ما يناسب ذوقك من خلال خيارات البحث المتعددة.
          </p>

          <div className={cn("border rounded-2xl p-4 md:p-6 backdrop-blur-md", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm")}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-white/40" : "text-black/40")} />
                <Input
                  placeholder="ابحث بالاسم أو الرقم..."
                  className={cn("pr-10", inputClass)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className={selectTriggerClass}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="المدينة" />
                  </div>
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="all">كل المدن</SelectItem>
                  <SelectItem value="القاهرة">القاهرة</SelectItem>
                  <SelectItem value="الجيزة">الجيزة</SelectItem>
                  <SelectItem value="الإسكندرية">الإسكندرية</SelectItem>
                  <SelectItem value="الشرقية">الشرقية</SelectItem>
                  <SelectItem value="المنصورة">المنصورة</SelectItem>
                  <SelectItem value="أسيوط">أسيوط</SelectItem>
                  <SelectItem value="الغردقة">الغردقة</SelectItem>
                  <SelectItem value="شرم الشيخ">شرم الشيخ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className={selectTriggerClass}>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="الحالة" />
                  </div>
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="available">متاح فقط</SelectItem>
                  <SelectItem value="unavailable">غير متاح</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="الترتيب" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="date_desc">الأحدث أولاً</SelectItem>
                  <SelectItem value="date_asc">الأقدم أولاً</SelectItem>
                  <SelectItem value="price_asc">الأقل سعراً</SelectItem>
                  <SelectItem value="price_desc">الأعلى سعراً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("min-h-screen transition-colors duration-300", isDark ? "bg-black" : "bg-gray-50")}>
        <div className="container mx-auto px-4 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className={cn("h-[450px] w-full rounded-2xl", isDark ? "bg-white/5" : "bg-black/5")} />
              ))}
            </div>
          ) : data?.data?.length ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {data.data.map((apt, index) => (
                  <ApartmentCard key={apt.id} apartment={apt} index={index} />
                ))}
              </div>

              {data.total > data.limit && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className={cn("border", isDark ? "border-white/10 text-white hover:bg-white/5" : "border-black/10 text-black hover:bg-black/5")}
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    السابق
                  </Button>
                  <span className={cn("mx-4", isDark ? "text-white/60" : "text-black/60")}>
                    صفحة {page} من {Math.ceil(data.total / data.limit)}
                  </span>
                  <Button
                    variant="outline"
                    className={cn("border", isDark ? "border-white/10 text-white hover:bg-white/5" : "border-black/10 text-black hover:bg-black/5")}
                    disabled={page >= Math.ceil(data.total / data.limit)}
                    onClick={() => setPage(p => p + 1)}
                  >
                    التالي
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className={cn("py-32 flex flex-col items-center justify-center text-center border rounded-3xl", isDark ? "border-white/5 bg-white/[0.02]" : "border-black/5 bg-black/[0.02]")}>
              <Search className={cn("w-16 h-16 mb-6", isDark ? "text-white/20" : "text-black/20")} />
              <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>لا توجد نتائج</h3>
              <p className={cn("max-w-md", isDark ? "text-white/50" : "text-black/50")}>
                لم نتمكن من العثور على وحدات سكنية تطابق معايير البحث الخاصة بك. جرب تغيير فلاتر البحث.
              </p>
              <Button
                variant="outline"
                className="mt-8 border-primary text-primary hover:bg-primary/10"
                onClick={() => { setSearch(""); setCity("all"); setStatus("all"); }}
              >
                إعادة ضبط الفلاتر
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
