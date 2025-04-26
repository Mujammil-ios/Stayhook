import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import Property from "@/pages/property";
import Rooms from "@/pages/rooms";
import Bookings from "@/pages/bookings";
import Reservations from "@/pages/reservations";
import Staff from "@/pages/staff";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Help from "@/pages/help";
import FormsDemo from "@/pages/forms-demo";
import { ThemeProvider } from "@/hooks/useThemeContext";
import { AuthProvider, useAuth } from "@/hooks/useAuthContext";

// Import auth pages
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";

function Router() {
  return (
    <Routes />
  );
}

function Routes() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show auth pages
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route>
            <Login />
          </Route>
        </Switch>
      </div>
    );
  }
  
  // If authenticated, show main app
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/property" component={Property} />
        <Route path="/rooms" component={Rooms} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/reservations" component={Reservations} />
        <Route path="/staff" component={Staff} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/settings" component={Settings} />
        <Route path="/help" component={Help} />
        <Route path="/forms-demo" component={FormsDemo} />
        <Route path="/privacy-policy" component={() => import("@/pages/privacy-policy").then(module => <module.default />)} />
        <Route path="/terms-and-conditions" component={() => import("@/pages/terms-and-conditions").then(module => <module.default />)} />
        <Route path="/room-types" component={() => import("@/pages/room-types").then(module => <module.default />)} />
        <Route path="/recent-bookings" component={() => import("@/pages/recent-bookings").then(module => <module.default />)} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);

  // Hydration fix - ensures theme is only applied after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get default theme preference from localStorage or system
  const getSavedTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme as 'light' | 'dark' | 'system';
      }
    }
    return 'system';
  };

  return (
    <ThemeProvider defaultTheme={getSavedTheme()}>
      <div className={mounted ? '' : 'invisible'}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
