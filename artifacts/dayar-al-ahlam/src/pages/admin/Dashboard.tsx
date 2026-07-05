import { AdminLayout } from "@/components/admin/AdminLayout";
import { useGetStats, useListApartments, useDeleteApartment, useToggleApartmentStatus, getGetStatsQueryKey, getListApartmentsQueryKey } from "@workspace/api-client-react";
import { Building2, CheckCircle, XCircle, MapPin, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useGetStats();
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const { data: apartments, isLoading: isLoadingApartments } = useListApartments({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    limit: 100, // For admin we can fetch more
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
          <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-white/60">نظرة عامة على أداء المنصة والوحدات السكنية.</p>
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
            <Skeleton key={i} className="h-32 bg-white/5 rounded-2xl" />
          ))
        ) : (
          <>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 font-medium">إجمالي الوحدات</span>
                <Building2 className="text-primary w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.total || 0}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 font-medium">وحدات متاحة</span>
                <CheckCircle className="text-green-500 w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.available || 0}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 font-medium">وحدات غير متاحة</span>
                <XCircle className="text-red-500 w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.unavailable || 0}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 font-medium">مدن التغطية</span>
                <MapPin className="text-primary w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.cities || 0}</span>
            </div>
          </>
        )}
      </div>

      {/* Apartments Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-white">الوحدات السكنية</h2>
          <div className="w-full md:w-72">
            <Input 
              placeholder="ابحث بالاسم أو الرقم..." 
              className="bg-black/50 border-white/10 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-black/50 text-white/60 text-sm border-b border-white/10">
              <tr>
                <th className="py-4 px-6 font-medium">رقم الوحدة</th>
                <th className="py-4 px-6 font-medium">الاسم</th>
                <th className="py-4 px-6 font-medium">المدينة</th>
                <th className="py-4 px-6 font-medium">السعر (يومي)</th>
                <th className="py-4 px-6 font-medium">الحالة</th>
                <th className="py-4 px-6 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="text-white divide-y divide-white/5">
              {isLoadingApartments ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-6"><Skeleton className="h-10 w-full bg-white/5" /></td>
                  </tr>
                ))
              ) : apartments?.data?.length ? (
                apartments.data.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono text-white/80">{apt.apartmentNumber}</td>
                    <td className="py-4 px-6 font-medium">{apt.title}</td>
                    <td className="py-4 px-6 text-white/60">{apt.city}</td>
                    <td className="py-4 px-6 text-primary">{apt.priceDay} ر.س</td>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الوحدة السكنية نهائياً من قاعدة البيانات.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">إلغاء</AlertDialogCancel>
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
                  <td colSpan={6} className="py-12 text-center text-white/50">
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
