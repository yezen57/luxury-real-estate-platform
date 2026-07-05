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
import LogoFull from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";

const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: admin, isLoading: checkingAuth } = useGetAdminMe({
    query: {
      retry: false
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-80 pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <img src={LogoFull} alt="ديار الأحلام" className="h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-6">تسجيل الدخول للإدارة</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل اسم المستخدم" 
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="أدخل كلمة المرور" 
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
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
