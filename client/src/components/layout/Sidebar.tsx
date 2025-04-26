import { Link, useLocation } from "wouter";
import { currentUser } from "@/lib/data";

interface SidebarProps {
  mobileMenuOpen: boolean;
}

const Sidebar = ({ mobileMenuOpen }: SidebarProps) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    // Handle exact match for root path
    if (path === "/" && location === "/") return true;
    
    // Handle other paths
    return location === path || 
           (path !== "/" && location.startsWith(path));
  };

  const sidebarClasses = `
    fixed h-full z-10 w-64
    bg-sidebar transition-all duration-300
    border-r border-gray-200 dark:border-neutral-700
    md:flex md:flex-col
    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="p-5 flex items-center border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <i className="ri-hotel-line text-white"></i>
          </div>
          <h1 className="text-xl font-semibold">HotelHub</h1>
        </div>
      </div>
      
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Main</h3>
          <Link href="/dashboard" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/dashboard") || isActive("/") ? "active" : ""}`}>
            <i className="ri-dashboard-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Dashboard
          </Link>
          <Link href="/property" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/property") ? "active" : ""}`}>
            <i className="ri-building-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Property Profile
          </Link>
          <Link href="/rooms" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/rooms") ? "active" : ""}`}>
            <i className="ri-door-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Room Management
          </Link>
          <Link href="/bookings" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/bookings") ? "active" : ""}`}>
            <i className="ri-calendar-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Booking History
          </Link>
          <Link href="/reservations" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/reservations") ? "active" : ""}`}>
            <i className="ri-calendar-check-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Reservation System
          </Link>
        </div>
        
        <div className="mt-8 space-y-1">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Management</h3>
          <Link href="/staff" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/staff") ? "active" : ""}`}>
            <i className="ri-team-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Staff Portal
          </Link>
          <Link href="/analytics" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/analytics") ? "active" : ""}`}>
            <i className="ri-line-chart-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Revenue Analytics
          </Link>
        </div>
        
        <div className="mt-8 space-y-1">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">System</h3>
          <Link href="/settings" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/settings") ? "active" : ""}`}>
            <i className="ri-settings-3-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Settings
          </Link>
          <Link href="/help" className={`nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${isActive("/help") ? "active" : ""}`}>
            <i className="ri-question-line mr-3 text-neutral-500 group-hover:text-primary"></i>
            Help & Support
          </Link>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-lg font-medium">
            {currentUser.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-neutral-500">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
