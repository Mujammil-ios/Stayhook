const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 py-4 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-neutral-500">
          &copy; 2025 HotelHub Management System. All rights reserved.
        </div>
        <div className="mt-3 md:mt-0 flex space-x-4">
          <a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">Privacy Policy</a>
          <a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">Terms of Service</a>
          <a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
