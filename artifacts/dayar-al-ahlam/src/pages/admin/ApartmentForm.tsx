import { AdminLayout } from "@/components/admin/AdminLayout";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateApartment, useUpdateApartment, useGetApartment, getListApartmentsQueryKey, getGetStatsQueryKey, getGetApartmentQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  apartmentNumber: z.string().min(1, "رقم الوحدة مطلوب"),
  title: z.string().min(1, "اسم الوحدة مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  district: z.string().min(1, "الحي مطلوب"),
  address: z.string().min(1, "العنوان مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  rooms: z.coerce.number().min(1, "عدد الغرف مطلوب"),
  bathrooms: z.coerce.number().min(1, "عدد الحمامات مطلوب"),
  area: z.coerce.number().min(1, "المساحة مطلوبة"),
  priceDay: z.coerce.number().min(1, "السعر اليومي مطلوب"),
  priceWeek: z.coerce.number().min(1, "السعر الأسبوعي مطلوب"),
  priceMonth: z.coerce.number().min(1, "السعر الشهري مطلوب"),
  status: z.enum(["available", "unavailable"]).default("available"),
  images: z.array(z.object({ url: z.string().min(1, "الرابط مطلوب") })).optional().default([]),
  video: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApartmentForm() {
  const params = useParams();
  const isEdit = params.id !== undefined && params.id !== "new";
  const id = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apartment, isLoading: isLoadingApartment } = useGetApartment(id || "", {
    query: { enabled: isEdit }
  });

  const createMutation = useCreateApartment();
  const updateMutation = useUpdateApartment();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apartmentNumber: "",
      title: "",
      city: "",
      district: "",
      address: "",
      description: "",
      rooms: 1,
      bathrooms: 1,
      area: 0,
      priceDay: 0,
      priceWeek: 0,
      priceMonth: 0,
      status: "available",
      images: [],
      video: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  useEffect(() => {
    if (isEdit && apartment) {
      form.reset({
        apartmentNumber: apartment.apartmentNumber,
        title: apartment.title,
        city: apartment.city,
        district: apartment.district,
        address: apartment.address,
        description: apartment.description,
        rooms: apartment.rooms,
        bathrooms: apartment.bathrooms,
        area: apartment.area,
        priceDay: apartment.priceDay,
        priceWeek: apartment.priceWeek,
        priceMonth: apartment.priceMonth,
        status: apartment.status,
        images: apartment.images?.map(url => ({ url })) || [],
        video: apartment.video || "",
      });
    }
  }, [apartment, isEdit, form]);

  const onSubmit = (values: FormValues) => {
    const formattedValues = {
      ...values,
      images: values.images?.map(img => img.url).filter(Boolean) || [],
      video: values.video || undefined,
    };

    if (isEdit && id) {
      updateMutation.mutate(
        { id, data: formattedValues },
        {
          onSuccess: () => {
            toast({ title: "تم تحديث الوحدة بنجاح" });
            queryClient.invalidateQueries({ queryKey: getListApartmentsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetApartmentQueryKey(id) });
            setLocation("/admin");
          },
          onError: (err) => {
            console.error(err);
            toast({ variant: "destructive", title: "حدث خطأ أثناء التحديث" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: formattedValues },
        {
          onSuccess: () => {
            toast({ title: "تم إضافة الوحدة بنجاح" });
            queryClient.invalidateQueries({ queryKey: getListApartmentsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
            setLocation("/admin");
          },
          onError: (err) => {
            console.error(err);
            toast({ variant: "destructive", title: "حدث خطأ أثناء الإضافة، تأكد من تسجيل الدخول" });
          }
        }
      );
    }
  };

  const egyptCities = [
    "القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "المنصورة",
    "أسيوط", "الغردقة", "شرم الشيخ", "الإسماعيلية", "السويس",
    "بورسعيد", "المنيا", "سوهاج", "أسوان", "الأقصر",
  ];

  if (isEdit && isLoadingApartment) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? "تعديل وحدة سكنية" : "إضافة وحدة جديدة"}
          </h1>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="apartmentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">رقم الوحدة (مثال: 00001)</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-white/10 text-white h-12 font-mono" placeholder="00001" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">اسم الوحدة (للعرض)</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">المدينة</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/50 border-white/10 text-white h-12">
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-white/10 text-white">
                          {egyptCities.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">الحي / المنطقة</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">العنوان التفصيلي</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">عدد الغرف</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">عدد الحمامات</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">المساحة (متر مربع)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="priceDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">السعر اليومي (ج.م)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">السعر الأسبوعي (ج.م)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">السعر الشهري (ج.م)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="bg-black/50 border-white/10 text-white h-12" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">الحالة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/50 border-white/10 text-white h-12">
                          <SelectValue placeholder="اختر حالة الوحدة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900 border-white/10 text-white">
                        <SelectItem value="available">متاح</SelectItem>
                        <SelectItem value="unavailable">غير متاح</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">الوصف</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-black/50 border-white/10 text-white min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-white/80 text-lg">روابط الصور</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ url: "" })}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة صورة
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <div className="flex-1">
                          <FormControl>
                            <Input placeholder="رابط الصورة (URL)" className="bg-black/50 border-white/10 text-white h-12" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-12 w-12 shrink-0"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </FormItem>
                    )}
                  />
                ))}
                {fields.length === 0 && (
                  <p className="text-white/40 text-sm italic">لم يتم إضافة صور. سيتم استخدام شعار ديار الأحلام كصورة افتراضية.</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">رابط الفيديو (اختياري)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." className="bg-black/50 border-white/10 text-white h-12" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                <Link href="/admin">
                  <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 px-8">
                    إلغاء
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-primary text-black hover:bg-primary/90 font-bold h-12 px-8"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? "جاري الحفظ..." : "حفظ الوحدة"}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
}
