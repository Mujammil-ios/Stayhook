import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useThemeContext";
import { notificationsData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Generate breadcrumb from current path
  const generateBreadcrumb = () => {
    if (location === "/") return [{ label: "Dashboard", path: "/" }];
    
    const paths = location.split("/").filter(Boolean);
    return [
      { label: "Home", path: "/" },
      ...paths.map((path, index) => {
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
        const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
        return { label: formattedPath, path: fullPath };
      })
    ];
  };

  const breadcrumbs = generateBreadcrumb();

  // Ensure theme toggle works correctly after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="md:hidden text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 p-2 rounded-lg transition-colors duration-200 active:bg-neutral-100 dark:active:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
          onClick={toggleMobileMenu}
          aria-label="Open menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        
        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center text-sm font-medium overflow-x-auto scrollbar-hide max-w-[40%] md:max-w-[60%] whitespace-nowrap">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center">
              {index > 0 && (
                <svg className="mx-2 h-4 w-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-neutral-800 dark:text-neutral-200 truncate">{crumb.label}</span>
              ) : (
                <Link href={crumb.path} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 truncate active:opacity-70 transition-opacity duration-150">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search */}
          <div className="hidden sm:block relative w-40 md:w-56 transition-all duration-200">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="ri-search-line text-neutral-400"></i>
            </span>
            <input 
              type="text" 
              className="w-full pl-8 pr-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-sm transition-colors duration-200" 
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
          
          {/* Notifications */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost" 
                size="icon" 
                className="relative focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-colors duration-200 active:bg-neutral-100 dark:active:bg-neutral-700"
                aria-label="Notifications"
              >
                <i className="ri-notification-3-line text-xl text-neutral-500 dark:text-neutral-400"></i>
                <Badge className="absolute top-0 right-0 h-2 w-2 p-0 rounded-full bg-red-500 border-0" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[90vw] sm:w-80 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-lg rounded-lg">
              <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150">Mark all as read</Button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {notificationsData.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-0 focus:bg-transparent focus:text-inherit">
                    <div className="w-full p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className={cn(
                          "flex-shrink-0 rounded-full p-2",
                          notification.type === "warning" && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300",
                          notification.type === "success" && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300",
                          notification.type === "info" && "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300"
                        )}>
                          <i className={`ri-${notification.icon} text-sm`}></i>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{notification.description}</p>
                          <div className="mt-1 flex">
                            <span className="text-xs text-neutral-400 dark:text-neutral-500">{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t border-neutral-200 dark:border-neutral-700 text-center">
                <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme toggle */}
          {isMounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleThemeToggle}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-colors duration-200 active:bg-neutral-100 dark:active:bg-neutral-700"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <i className={`ri-sun-line text-xl hidden dark:block text-neutral-400 dark:text-neutral-300 transition-opacity duration-200 active:opacity-60`}></i>
              <i className={`ri-moon-line text-xl block dark:hidden text-neutral-500 transition-opacity duration-200 active:opacity-60`}></i>
              <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
            </Button>
          )}

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-colors duration-200 active:bg-neutral-100 dark:active:bg-neutral-700"
            aria-label="Search"
          >
            <i className="ri-search-line text-xl text-neutral-500 dark:text-neutral-400"></i>
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
