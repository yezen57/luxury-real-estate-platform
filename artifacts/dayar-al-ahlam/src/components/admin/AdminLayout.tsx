import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Plus, Home } from "lucide-react";
import LogoIconGold from "@assets/ديار_بدون_خلفيه-01_1783264617963.png";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading, isError } = useGetAdminMe({
    query: {
      retry: false
    }
  });

  const logout = useAdminLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !admin?.authenticated) {
    setLocation("/admin/login");
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
    <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans selection:bg-primary selection:text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/5 border-l border-white/10 flex flex-col">
        <div className="p-6 flex items-center gap-4 border-b border-white/10">
          <img src={LogoIconGold} alt="Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin">
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:bg-white/10 ${location === "/admin" ? "bg-white/10 border border-white/10" : ""}`}
            >
              <LayoutDashboard className="ml-2 w-5 h-5" />
              الرئيسية
            </Button>
          </Link>
          <Link href="/admin/apartments/new">
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:bg-white/10 ${location === "/admin/apartments/new" ? "bg-white/10 border border-white/10" : ""}`}
            >
              <Plus className="ml-2 w-5 h-5" />
              إضافة وحدة
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 mt-8"
            >
              <Home className="ml-2 w-5 h-5" />
              الموقع الرئيسي
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
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
      <main className="flex-1 overflow-auto bg-black p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
