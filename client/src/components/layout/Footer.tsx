import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 py-4 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center md:text-left">
          &copy; {new Date().getFullYear()} HotelHub Management System. All rights reserved.
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 md:gap-6">
          <Link to="/help#privacy" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150 active:opacity-80">
            Privacy Policy
          </Link>
          <Link to="/help#terms" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150 active:opacity-80">
            Terms of Service
          </Link>
          <Link to="/help#contact" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150 active:opacity-80">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
