import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:text-left text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} InsureRide. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">
          Providing micro-insurance safety nets for Boda Boda riders.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
