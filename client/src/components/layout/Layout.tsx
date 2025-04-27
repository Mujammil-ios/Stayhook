import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

// Simplified Layout component without hooks for testing
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="flex flex-1 relative">
        <div className="fixed h-full z-40 w-64 
          bg-white dark:bg-neutral-800 transition-transform duration-300 ease-in-out
          border-r border-gray-200 dark:border-neutral-700
          md:flex md:flex-col translate-x-0 shadow-none">
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
              <a href="/" className="nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 group transition-colors duration-150 cursor-pointer">
                <i className="ri-dashboard-line mr-3 text-neutral-500 group-hover:text-primary transition-colors duration-150"></i>
                <span className="truncate">Dashboard</span>
              </a>
              <a href="/live-monitoring" className="nav-link flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary dark:text-primary-foreground dark:bg-primary/20 hover:bg-neutral-100 dark:hover:bg-neutral-700 group transition-colors duration-150 cursor-pointer">
                <i className="ri-radar-line mr-3 text-primary group-hover:text-primary transition-colors duration-150"></i>
                <span className="truncate">Live Monitoring</span>
              </a>
            </div>
          </nav>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 md:ml-64 flex flex-col w-full">
          <header className="h-16 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 sticky top-0 z-30 flex items-center px-4 sm:px-6">
            <div className="flex w-full justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold">HotelHub</h1>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </main>
          
          <footer className="border-t border-gray-200 dark:border-neutral-700 py-4 px-6 text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} HotelHub. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
