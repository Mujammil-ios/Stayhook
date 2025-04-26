import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
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

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

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

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="md:hidden text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400"
          onClick={toggleMobileMenu}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        
        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center text-sm font-medium">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center">
              {index > 0 && (
                <svg className="mx-2 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-neutral-800 dark:text-neutral-200">{crumb.label}</span>
              ) : (
                <Link href={crumb.path}>
                  <a className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">{crumb.label}</a>
                </Link>
              )}
            </div>
          ))}
        </nav>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:block relative w-56">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="ri-search-line text-neutral-400"></i>
            </span>
            <input 
              type="text" 
              className="w-full pl-8 pr-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-sm" 
              placeholder="Search..."
            />
          </div>
          
          {/* Notifications */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative tooltip" data-tooltip="Notifications">
                <i className="ri-notification-3-line text-xl text-neutral-500"></i>
                <Badge className="absolute top-0 right-0 h-2 w-2 p-0 rounded-full bg-red-500 border-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notificationsData.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-0 focus:bg-transparent">
                    <div className="w-full p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800">
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
                          <p className="mt-1 text-xs text-neutral-500">{notification.description}</p>
                          <div className="mt-1 flex">
                            <span className="text-xs text-neutral-400">{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full text-primary">View all notifications</Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="tooltip"
            data-tooltip="Toggle theme"
          >
            <i className="ri-sun-line text-xl hidden dark:block text-neutral-500"></i>
            <i className="ri-moon-line text-xl block dark:hidden text-neutral-500"></i>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
