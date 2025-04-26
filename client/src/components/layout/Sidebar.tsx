import { Link, useLocation } from "wouter";
import { currentUser } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

interface SidebarProps {
  mobileMenuOpen: boolean;
}

const Sidebar = ({ mobileMenuOpen }: SidebarProps) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    // Handle exact match for root path
    if (path === "/" && location === "/") return true;
    
    // Handle other paths
    return location === path || 
           (path !== "/" && location.startsWith(path));
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile) {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, isMobile]);

  const sidebarClasses = `
    fixed h-full z-30 w-64 
    bg-white dark:bg-neutral-800 transition-all duration-300 ease-in-out
    border-r border-gray-200 dark:border-neutral-700
    md:flex md:flex-col
    ${mobileMenuOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full md:translate-x-0 md:shadow-none'}
    touch-auto
  `;

  // Active link classes
  const activeLinkClass = "bg-primary/10 text-primary dark:text-primary-foreground dark:bg-primary/20";
  // Regular link hover classes
  const hoverClass = "hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary-foreground";

  return (
    <aside className={sidebarClasses}>
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <i className="ri-hotel-line text-white"></i>
          </div>
          <h1 className="text-xl font-semibold">HotelHub</h1>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Main</h3>
          <Link href="/dashboard" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/dashboard") || isActive("/") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/dashboard") || isActive("/") ? "page" : undefined}
          >
            <i className={`ri-dashboard-line mr-3 ${isActive("/dashboard") || isActive("/") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Dashboard</span>
          </Link>
          <Link href="/property" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/property") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/property") ? "page" : undefined}
          >
            <i className={`ri-building-line mr-3 ${isActive("/property") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Property Profile</span>
          </Link>
          <Link href="/rooms" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/rooms") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/rooms") ? "page" : undefined}
          >
            <i className={`ri-door-line mr-3 ${isActive("/rooms") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Room Management</span>
          </Link>
          <Link href="/bookings" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/bookings") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/bookings") ? "page" : undefined}
          >
            <i className={`ri-calendar-line mr-3 ${isActive("/bookings") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Booking History</span>
          </Link>
          <Link href="/reservations" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/reservations") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/reservations") ? "page" : undefined}
          >
            <i className={`ri-calendar-check-line mr-3 ${isActive("/reservations") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Reservation System</span>
          </Link>
        </div>
        
        <div className="mt-6 space-y-1">
          <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Management</h3>
          <Link href="/staff" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/staff") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/staff") ? "page" : undefined}
          >
            <i className={`ri-team-line mr-3 ${isActive("/staff") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Staff Portal</span>
          </Link>
          <Link href="/analytics" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/analytics") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/analytics") ? "page" : undefined}
          >
            <i className={`ri-line-chart-line mr-3 ${isActive("/analytics") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Revenue Analytics</span>
          </Link>
        </div>
        
        <div className="mt-6 space-y-1">
          <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">System</h3>
          <Link href="/settings" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/settings") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/settings") ? "page" : undefined}
          >
            <i className={`ri-settings-3-line mr-3 ${isActive("/settings") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Settings</span>
          </Link>
          <Link href="/help" 
            className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/help") ? activeLinkClass : ""} ${hoverClass} group transition-colors duration-150 cursor-pointer`}
            tabIndex={0}
            aria-current={isActive("/help") ? "page" : undefined}
          >
            <i className={`ri-question-line mr-3 ${isActive("/help") ? "text-primary" : "text-neutral-500"} group-hover:text-primary transition-colors duration-150`}></i>
            <span className="truncate">Help & Support</span>
          </Link>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-lg font-medium">
            {currentUser.name.charAt(0)}
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-neutral-500 truncate">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
