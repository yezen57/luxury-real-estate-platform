import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import LogoFullWhite from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import LogoFullGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: admin, isLoading: checkingAuth } = useGetAdminMe({
    query: {
      retry: false,
      queryKey: ["/api/admin/me"]
    }
  });

  const loginMutation = useAdminLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  if (admin?.authenticated && !checkingAuth) {
    setLocation("/admin");
    return null;
  }

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك في لوحة تحكم ديار الأحلام",
          });
          setLocation("/admin");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "خطأ في تسجيل الدخول",
            description: "تأكد من صحة اسم المستخدم وكلمة المرور.",
          });
        },
      }
    );
  }

  if (checkingAuth) return null;

  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300", isDark ? "bg-black" : "bg-gray-50")}>
      <div className={cn(
        "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] opacity-80 pointer-events-none",
        isDark ? "from-primary/10 via-black to-black" : "from-primary/5 via-gray-50 to-gray-50"
      )}></div>

      <div className={cn("relative w-full max-w-md border rounded-3xl p-8 backdrop-blur-xl shadow-2xl", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10")}>
        <div className="flex justify-center mb-8">
          <img src={isDark ? LogoFullWhite : LogoFullGold} alt="ديار الأحلام" className="h-16 object-contain" />
        </div>

        <h1 className={cn("text-2xl font-bold text-center mb-6", isDark ? "text-white" : "text-gray-900")}>تسجيل الدخول للإدارة</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isDark ? "text-white/80" : "text-black/80"}>اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم المستخدم"
                      className={cn("h-12 border", isDark ? "bg-black/50 border-white/10 text-white" : "bg-white border-black/10 text-gray-900")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isDark ? "text-white/80" : "text-black/80"}>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      className={cn("h-12 border", isDark ? "bg-black/50 border-white/10 text-white" : "bg-white border-black/10 text-gray-900")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-bold text-lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "جاري الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
