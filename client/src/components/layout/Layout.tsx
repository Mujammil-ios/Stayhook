import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();

  // Close mobile menu when location changes
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location, mobileMenuOpen]);

  // Close mobile menu on window resize (if desktop width is reached)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="flex flex-1 relative">
        <Sidebar mobileMenuOpen={mobileMenuOpen} />
        
        {/* Main content area */}
        <div className="flex-1 md:ml-64 flex flex-col w-full">
          <Header toggleMobileMenu={toggleMobileMenu} />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Layout;
