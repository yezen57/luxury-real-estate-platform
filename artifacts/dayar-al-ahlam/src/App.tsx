import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Apartments from "@/pages/Apartments";
import ApartmentDetail from "@/pages/ApartmentDetail";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import ApartmentForm from "@/pages/admin/ApartmentForm";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apartments" component={Apartments} />
      <Route path="/apartments/:id" component={ApartmentDetail} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/apartments/new" component={ApartmentForm} />
      <Route path="/admin/apartments/:id/edit" component={ApartmentForm} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
