const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 py-4 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-neutral-500 text-center md:text-left">
          &copy; 2025 HotelHub Management System. All rights reserved.
        </div>
        <div className="mt-3 md:mt-0 flex flex-wrap justify-center md:justify-end space-x-2 sm:space-x-4">
          <a 
            href="#" 
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            onClick={(e) => {
              e.preventDefault();
              // Navigation or modal to show privacy policy
            }}
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            onClick={(e) => {
              e.preventDefault();
              // Navigation or modal to show terms of service
            }}
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            onClick={(e) => {
              e.preventDefault();
              // Navigation or modal to show contact support
            }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
