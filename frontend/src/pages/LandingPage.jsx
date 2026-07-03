import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col justify-center">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-black text-primary tracking-tight leading-none mb-6">
          Micro-Insurance Safety Nets for Boda Boda Riders
        </h1>
        <p className="text-lg text-gray-500 font-semibold leading-relaxed">
          Ensure continuous medical and accident coverage with small, daily premium top-ups.
          Hospitals verify claims instantly via secure credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        {/* Rider Portal Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col justify-between hover:border-primary transition-colors">
          <div>
            <div className="p-3 bg-blue-50 inline-block rounded-lg text-primary mb-6">
              <IdentificationIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-primary tracking-tight mb-3">Worker Portal</h3>
            <p className="text-gray-500 font-semibold mb-6">
              Check your daily insurance coverage status, see time remaining on your active policy,
              and process quick 20 KES premium top-ups instantly.
            </p>
          </div>
          <Link
            to="/worker"
            className="w-full bg-primary text-white text-center py-3.5 rounded-lg font-bold hover:bg-opacity-90 transition-colors uppercase text-sm tracking-wider"
          >
            Access Rider Portal
          </Link>
        </div>

        {/* Hospital Portal Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col justify-between hover:border-success transition-colors">
          <div>
            <div className="p-3 bg-green-50 inline-block rounded-lg text-success mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-black text-primary tracking-tight mb-3">Hospital Portal</h3>
            <p className="text-gray-500 font-semibold mb-6">
              Onboard your clinic or hospital, securely extract your API key, and instantly verify
              active coverage status for patients presenting claims.
            </p>
          </div>
          <Link
            to="/hospital"
            className="w-full bg-success text-white text-center py-3.5 rounded-lg font-bold hover:bg-green-700 transition-colors uppercase text-sm tracking-wider"
          >
            Access Hospital Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
