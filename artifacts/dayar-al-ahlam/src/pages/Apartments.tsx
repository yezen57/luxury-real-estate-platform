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

export default function Apartments() {
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

  return (
    <Layout>
      <div className="dark:bg-black bg-gray-50 border-b border-black/5 dark:border-white/5 pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-black mb-6">
            الوحدات <span className="text-primary">السكنية</span>
          </h1>
          <p className="text-black/60 dark:text-white/60 text-lg max-w-2xl mb-10">
            تصفح مجموعتنا الحصرية من الشقق الفاخرة، واختر ما يناسب ذوقك من خلال خيارات البحث المتعددة.
          </p>

          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md shadow-sm dark:shadow-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 w-5 h-5" />
                <Input
                  placeholder="ابحث بالاسم أو الرقم..."
                  className="pr-10 bg-gray-50 dark:bg-black/50 border-black/10 dark:border-white/10 focus-visible:ring-primary text-black dark:text-white h-12"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-12 bg-gray-50 dark:bg-black/50 border-black/10 dark:border-white/10 text-black dark:text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="المدينة" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-black/10 dark:border-white/10 text-black dark:text-white">
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
                <SelectTrigger className="h-12 bg-gray-50 dark:bg-black/50 border-black/10 dark:border-white/10 text-black dark:text-white">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="الحالة" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-black/10 dark:border-white/10 text-black dark:text-white">
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="available">متاح فقط</SelectItem>
                  <SelectItem value="unavailable">غير متاح</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 bg-gray-50 dark:bg-black/50 border-black/10 dark:border-white/10 text-black dark:text-white">
                  <SelectValue placeholder="الترتيب" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-black/10 dark:border-white/10 text-black dark:text-white">
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

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[450px] w-full rounded-2xl bg-black/5 dark:bg-white/5" />
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
                  className="border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  السابق
                </Button>
                <span className="text-black/60 dark:text-white/60 mx-4">
                  صفحة {page} من {Math.ceil(data.total / data.limit)}
                </span>
                <Button
                  variant="outline"
                  className="border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  disabled={page >= Math.ceil(data.total / data.limit)}
                  onClick={() => setPage(p => p + 1)}
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/5 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02]">
            <Search className="w-16 h-16 text-black/20 dark:text-white/20 mb-6" />
            <h3 className="text-2xl font-bold dark:text-white text-black mb-2">لا توجد نتائج</h3>
            <p className="text-black/50 dark:text-white/50 max-w-md">
              لم نتمكن من العثور على وحدات سكنية تطابق معايير البحث الخاصة بك. جرب تغيير فلاتر البحث.
            </p>
            <Button
              variant="outline"
              className="mt-8 border-primary text-primary hover:bg-primary/10"
              onClick={() => {
                setSearch(""); setCity("all"); setStatus("all");
              }}
            >
              إعادة ضبط الفلاتر
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
