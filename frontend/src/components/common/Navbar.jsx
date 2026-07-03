import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-xl font-extrabold text-primary tracking-tight">
                InsureRide
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              <NavLink
                to="/worker"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                Worker Portal
              </NavLink>
              <NavLink
                to="/hospital"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                Hospital Portal
              </NavLink>
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <div className="flex space-x-2">
              <Link
                to="/worker"
                className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-800 rounded"
              >
                Riders
              </Link>
              <Link
                to="/hospital"
                className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded"
              >
                Hospitals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
