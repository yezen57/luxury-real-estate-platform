import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn(
      "min-h-[100dvh] flex flex-col font-sans selection:bg-primary selection:text-black transition-colors duration-300",
      isDark ? "bg-black text-white" : "bg-[#faf8f4] text-gray-900"
    )}>
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
