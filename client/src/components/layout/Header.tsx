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
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const isMobile = useIsMobile();

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showNotifications) {
        setShowNotifications(false);
      }
    };
    
    // Add timeout to allow the menu to close properly
    const timeoutId = setTimeout(() => {
      if (showNotifications) {
        document.addEventListener('click', handleClickOutside);
      }
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNotifications]);

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    // Store the theme preference in localStorage for persistence
    localStorage.setItem('theme', theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile menu button with improved accessibility and touch target */}
        <button 
          type="button" 
          className="md:hidden text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobile}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        
        {/* Breadcrumb - improved for smaller screens */}
        <nav className="hidden sm:flex items-center text-sm font-medium overflow-x-auto max-w-[50%] scrollbar-hide">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center whitespace-nowrap">
              {index > 0 && (
                <svg className="mx-2 h-4 w-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">{crumb.label}</span>
              ) : (
                <Link href={crumb.path} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none focus:underline">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        
        {/* Current page title on mobile */}
        <div className="sm:hidden font-medium truncate">
          {breadcrumbs[breadcrumbs.length - 1].label}
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search - with responsive toggle on mobile */}
          <div className={cn(
            "relative transition-all duration-300 ease-in-out",
            isSearchActive ? "w-full absolute left-0 top-0 h-16 px-4 z-30 bg-white dark:bg-neutral-800 flex items-center" : "hidden sm:block w-56"
          )}>
            {isSearchActive && (
              <button 
                className="mr-3 text-neutral-500"
                onClick={() => setIsSearchActive(false)}
                aria-label="Close search"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
            )}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <i className="ri-search-line text-neutral-400"></i>
              </span>
              <input 
                type="text" 
                className="w-full pl-8 pr-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-sm" 
                placeholder="Search..."
                aria-label="Search"
              />
            </div>
          </div>
          
          {/* Mobile search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchActive(true)}
            className="sm:hidden"
            aria-label="Search"
          >
            <i className="ri-search-line text-xl text-neutral-500"></i>
          </Button>
          
          {/* Notifications */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50" 
                aria-label="Notifications"
              >
                <i className="ri-notification-3-line text-xl text-neutral-500"></i>
                <Badge className="absolute top-0 right-0 h-2 w-2 p-0 rounded-full bg-red-500 border-0" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[90vw]">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mark all as read functionality would go here
                  }}
                >
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                {notificationsData.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-0 focus:bg-transparent" onSelect={(e) => e.preventDefault()}>
                    <button 
                      className="w-full text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle notification click
                      }}
                    >
                      <div className="flex items-start">
                        <div className={cn(
                          "flex-shrink-0 rounded-full p-2",
                          notification.type === "warning" && "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
                          notification.type === "success" && "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
                          notification.type === "info" && "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
                        )}>
                          <i className={`ri-${notification.icon} text-sm`}></i>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{notification.description}</p>
                          <div className="mt-1 flex">
                            <span className="text-xs text-neutral-400">{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(false);
                    // Navigate to all notifications
                  }}
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme toggle with improved interaction */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <i className={cn(
              "text-xl transition-opacity duration-300",
              theme === "dark" ? "ri-sun-line text-neutral-300" : "ri-moon-line text-neutral-500"
            )}></i>
            <span className="sr-only">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
