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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <div className="flex flex-1">
        <Sidebar mobileMenuOpen={mobileMenuOpen} />
        
        {/* Main content area */}
        <div className="flex-1 md:ml-64 flex flex-col">
          <Header toggleMobileMenu={toggleMobileMenu} />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-20"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
};

export default Layout;
