import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import ClaimVerification from './ClaimVerification';
import ClaimHistory from './ClaimHistory';
import { KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const HospitalDashboard = () => {
  const { apiKey, hospitalName, logout, fetchHospitalInfo } = useAuthStore();
  const [activeTab, setActiveTab] = useState('verify');

  useEffect(() => {
    fetchHospitalInfo();
  }, [fetchHospitalInfo]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-primary tracking-tight">
              {hospitalName || 'Hospital Portal'}
            </h1>
            <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded">
              Connected
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded">
              <KeyIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              <span className="font-mono text-xs text-primary">
                {apiKey.substring(0, 12)}...{apiKey.substring(apiKey.length - 8)}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-danger hover:text-red-800 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'verify'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-primary hover:border-gray-300'
            }`}
          >
            Verify Claim
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'history'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-primary hover:border-gray-300'
            }`}
          >
            Claim History
          </button>
        </div>

        <div className="mt-8">
          {activeTab === 'verify' ? <ClaimVerification /> : <ClaimHistory />}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
