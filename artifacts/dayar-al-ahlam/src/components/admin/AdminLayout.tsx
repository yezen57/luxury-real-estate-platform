import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Plus, Home, Sun, Moon } from "lucide-react";
import LogoIconWhite from "@assets/ديار_بدون_خلفيه-02_1783264617965.png";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";
import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading } = useGetAdminMe({
    query: {
      retry: false,
      queryKey: ["/api/admin/me"]
    }
  });

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const logout = useAdminLogout();
  const isError = !isLoading && !admin;

  useEffect(() => {
    if (!isLoading && (isError || !admin?.authenticated)) {
      setLocation("/admin/login");
    }
  }, [isLoading, isError, admin, setLocation]);

  if (isLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-black" : "bg-white")}>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !admin?.authenticated) {
    return null;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login");
      }
    });
  };

  return (
    <div className={cn("min-h-screen flex flex-col md:flex-row font-sans selection:bg-primary selection:text-black transition-colors duration-300", isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900")}>
      {/* Sidebar */}
      <aside className={cn("w-full md:w-64 border-l flex flex-col transition-colors duration-300", isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-black/10")}>
        <div className={cn("p-6 flex items-center justify-between border-b transition-colors duration-300", isDark ? "border-white/10" : "border-black/10")}>
          <div className="flex items-center gap-4">
            <img src={isDark ? LogoIconWhite : LogoIconGold} alt="Logo" className="w-10 h-10 object-contain" />
            <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>لوحة التحكم</h2>
          </div>
          <button
            onClick={toggleTheme}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:text-primary",
              isDark
                ? "border-white/15 text-white/70"
                : "border-black/15 text-black/70"
            )}
            aria-label="تبديل الوضع"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin">
            <Button
              variant="ghost"
              className={cn(`w-full justify-start`, 
                isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5",
                location === "/admin" ? (isDark ? "bg-white/10 border border-white/10" : "bg-black/5 border border-black/10") : ""
              )}
            >
              <LayoutDashboard className="ml-2 w-5 h-5" />
              الرئيسية
            </Button>
          </Link>
          <Link href="/admin/apartments/new">
            <Button
              variant="ghost"
              className={cn(`w-full justify-start`, 
                isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5",
                location === "/admin/apartments/new" ? (isDark ? "bg-white/10 border border-white/10" : "bg-black/5 border border-black/10") : ""
              )}
            >
              <Plus className="ml-2 w-5 h-5" />
              إضافة وحدة
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className={cn("w-full justify-start mt-8", isDark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-black/60 hover:text-black hover:bg-black/5")}
            >
              <Home className="ml-2 w-5 h-5" />
              الموقع الرئيسي
            </Button>
          </Link>
        </nav>

        <div className={cn("p-4 border-t transition-colors duration-300", isDark ? "border-white/10" : "border-black/10")}>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="ml-2 w-5 h-5" />
            {logout.isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
