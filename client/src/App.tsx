import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Switch, Route, useLocation } from "wouter";
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
import LiveMonitoring from "@/pages/live-monitoring";
import Onboarding from "@/pages/onboarding";
import { ThemeProvider } from "@/hooks/useThemeContext";
import { AuthProvider, useAuth } from "@/hooks/useAuthContext";
import { OnboardingProvider } from "@/features/onboarding/hooks/useOnboarding";
import { CreateReservation } from "@/features/reservation/components/CreateReservation";

// Import auth pages
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";

// Lazy loaded components
const PrivacyPolicy = React.lazy(() => import("@/pages/privacy-policy"));
const TermsAndConditions = React.lazy(
  () => import("@/pages/terms-and-conditions"),
);
const RoomTypes = React.lazy(() => import("@/pages/room-types"));
const RecentBookings = React.lazy(() => import("@/pages/recent-bookings"));
const CustomerSupport = React.lazy(() => import("@/pages/customer-support"));

function Router() {
  return <Routes />;
}

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex h-[80vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm text-neutral-500">Loading...</p>
    </div>
  </div>
);

function Routes() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(`[Router] Route changed to: ${location}`);
  }, [location]);

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
  if (!isAuthenticated && location !== "/onboarding") {
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
  // Note: Key prop forces Layout to re-render when location changes

  // Handle the onboarding page separately - it should not use the regular Layout
  // if (location === "/onboarding") {
  //   return (
  //     <Suspense fallback={<LoadingIndicator />}>
  //       <Onboarding />
  //     </Suspense>
  //   );
  // }

  return (
    <Layout key={location}>
      <Suspense fallback={<LoadingIndicator />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/property" component={Property} />
          <Route path="/onboarding" component={Property} />
          <Route path="/rooms" component={Rooms} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/reservations/create" component={CreateReservation} />
          <Route path="/staff" component={Staff} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/settings" component={Settings} />
          <Route path="/live-monitoring" component={LiveMonitoring} />
          <Route path="/help" component={Help} />
          <Route path="/forms-demo" component={FormsDemo} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-and-conditions" component={TermsAndConditions} />
          <Route path="/room-types" component={RoomTypes} />
          <Route path="/recent-bookings" component={RecentBookings} />
          <Route path="/customer-support" component={CustomerSupport} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
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
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        return savedTheme as "light" | "dark" | "system";
      }
    }
    return "system";
  };

  return (
    <ThemeProvider defaultTheme={getSavedTheme()}>
      <div className={mounted ? "" : "invisible"}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <OnboardingProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </OnboardingProvider>
          </QueryClientProvider>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
