import { AdminLayout } from "@/components/admin/AdminLayout";
import { useGetStats, useListApartments, useDeleteApartment, useToggleApartmentStatus, getGetStatsQueryKey, getListApartmentsQueryKey } from "@workspace/api-client-react";
import { Building2, CheckCircle, XCircle, MapPin, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useGetStats();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const { data: apartments, isLoading: isLoadingApartments } = useListApartments({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    limit: 100,
    sortBy: "date_desc"
  });

  const deleteMutation = useDeleteApartment();
  const toggleStatusMutation = useToggleApartmentStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListApartmentsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        },
        onError: () => {
          toast({ variant: "destructive", title: "حدث خطأ أثناء الحذف" });
        }
      }
    );
  };

  const handleToggleStatus = (id: string, currentStatus: "available" | "unavailable") => {
    const newStatus = currentStatus === "available" ? "unavailable" : "available";
    toggleStatusMutation.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({ title: "تم تحديث الحالة بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListApartmentsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        },
        onError: () => {
          toast({ variant: "destructive", title: "حدث خطأ أثناء التحديث" });
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>لوحة التحكم</h1>
          <p className={isDark ? "text-white/60" : "text-black/60"}>نظرة عامة على أداء المنصة والوحدات السكنية.</p>
        </div>
        <Link href="/admin/apartments/new">
          <Button className="bg-primary text-black hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> إضافة وحدة جديدة
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoadingStats ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className={cn("h-32 rounded-2xl", isDark ? "bg-white/5" : "bg-black/5")} />
          ))
        ) : (
          <>
            <div className={cn("border rounded-2xl p-6 flex flex-col", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm")}>
              <div className="flex items-center justify-between mb-4">
                <span className={cn("font-medium", isDark ? "text-white/60" : "text-black/60")}>إجمالي الوحدات</span>
                <Building2 className="text-primary w-5 h-5" />
              </div>
              <span className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stats?.total || 0}</span>
            </div>
            <div className={cn("border rounded-2xl p-6 flex flex-col", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm")}>
              <div className="flex items-center justify-between mb-4">
                <span className={cn("font-medium", isDark ? "text-white/60" : "text-black/60")}>وحدات متاحة</span>
                <CheckCircle className="text-green-500 w-5 h-5" />
              </div>
              <span className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stats?.available || 0}</span>
            </div>
            <div className={cn("border rounded-2xl p-6 flex flex-col", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm")}>
              <div className="flex items-center justify-between mb-4">
                <span className={cn("font-medium", isDark ? "text-white/60" : "text-black/60")}>وحدات غير متاحة</span>
                <XCircle className="text-red-500 w-5 h-5" />
              </div>
              <span className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stats?.unavailable || 0}</span>
            </div>
            <div className={cn("border rounded-2xl p-6 flex flex-col", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm")}>
              <div className="flex items-center justify-between mb-4">
                <span className={cn("font-medium", isDark ? "text-white/60" : "text-black/60")}>مدن التغطية</span>
                <MapPin className="text-primary w-5 h-5" />
              </div>
              <span className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stats?.cities || 0}</span>
            </div>
          </>
        )}
      </div>

      {/* Apartments Table */}
      <div className={cn("border rounded-2xl overflow-hidden", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm")}>
        <div className={cn("p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4", isDark ? "border-white/10" : "border-black/10")}>
          <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>الوحدات السكنية</h2>
          <div className="w-full md:w-72">
            <Input
              placeholder="ابحث بالاسم أو الرقم..."
              className={cn("border", isDark ? "bg-black/50 border-white/10 text-white" : "bg-white border-black/10 text-black")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className={cn("text-sm border-b", isDark ? "bg-black/50 text-white/60 border-white/10" : "bg-black/5 text-black/60 border-black/10")}>
              <tr>
                <th className="py-4 px-6 font-medium">رقم الوحدة</th>
                <th className="py-4 px-6 font-medium">الاسم</th>
                <th className="py-4 px-6 font-medium">المدينة</th>
                <th className="py-4 px-6 font-medium">السعر (يومي)</th>
                <th className="py-4 px-6 font-medium">الحالة</th>
                <th className="py-4 px-6 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "text-white divide-white/5" : "text-gray-900 divide-black/5")}>
              {isLoadingApartments ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-6"><Skeleton className={cn("h-10 w-full", isDark ? "bg-white/5" : "bg-black/5")} /></td>
                  </tr>
                ))
              ) : apartments?.data?.length ? (
                apartments.data.map((apt) => (
                  <tr key={apt.id} className={cn("transition-colors", isDark ? "hover:bg-white/[0.02]" : "hover:bg-black/[0.02]")}>
                    <td className={cn("py-4 px-6 font-mono", isDark ? "text-white/80" : "text-black/80")}>{String(apt.apartmentNumber).padStart(5, '0')}</td>
                    <td className="py-4 px-6 font-medium">{apt.title}</td>
                    <td className={cn("py-4 px-6", isDark ? "text-white/60" : "text-black/60")}>{apt.city}</td>
                    <td className="py-4 px-6 text-primary">{apt.priceDay} ج.م</td>
                    <td className="py-4 px-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(apt.id, apt.status)}
                        className={`h-8 rounded-full px-4 text-xs font-medium ${
                          apt.status === "available"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        }`}
                      >
                        {apt.status === "available" ? "متاح" : "غير متاح"}
                      </Button>
                    </td>
                    <td className="py-4 px-6 flex justify-end gap-2">
                      <Link href={`/admin/apartments/${apt.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className={cn("border", isDark ? "bg-gray-900 border-white/10 text-white" : "bg-white border-black/10 text-gray-900")}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                            <AlertDialogDescription className={isDark ? "text-white/60" : "text-black/60"}>
                              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الوحدة السكنية نهائياً من قاعدة البيانات.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className={cn("border hover:bg-black/5", isDark ? "bg-transparent border-white/10 hover:bg-white/5 text-white" : "bg-white border-black/10 hover:bg-black/5 text-black")}>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(apt.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              تأكيد الحذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={cn("py-12 text-center", isDark ? "text-white/50" : "text-black/50")}>
                    لا توجد وحدات سكنية حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
