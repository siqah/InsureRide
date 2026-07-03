import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import HospitalDashboard from '../components/hospital/HospitalDashboard';
import HospitalRegistration from '../components/hospital/HospitalRegistration';
import { ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';

const HospitalPortal = () => {
  const { isAuthenticated, login, loading, error } = useAuthStore();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      setLocalError('');
      try {
        await login(apiKeyInput.trim());
      } catch {
        // Error state handled in the store
      }
    } else {
      setLocalError('Please enter a valid API Key');
    }
  };

  const handleRegisterSuccess = (key) => {
    login(key);
  };

  if (isAuthenticated) {
    return <HospitalDashboard />;
  }

  const activeError = localError || error;

  return (
    <div className="flex-1 bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {mode === 'login' ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 max-w-md mx-auto shadow-sm w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-lg text-primary mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Hospital Administration</h2>
            <p className="text-gray-500 font-semibold mt-1">Authenticate using your unique API Key</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hospital API Key</label>
              <div className="relative">
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter X-API-KEY"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  required
                />
                <KeyIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-lg font-bold hover:bg-opacity-90 transition-all uppercase text-sm tracking-wider disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enter'}
            </button>

            {activeError && (
              <div className="mt-4 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold text-sm">
                {activeError}
              </div>
            )}
          </form>

          <div className="border-t border-gray-200 pt-6 mt-6 text-center">
            <p className="text-sm font-semibold text-gray-500">
              Need access for your hospital?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-primary hover:underline font-bold"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <HospitalRegistration onLoginWithKey={handleRegisterSuccess} />
          <div className="text-center mt-6">
            <button
              onClick={() => setMode('login')}
              className="text-sm font-bold text-primary hover:underline"
            >
              ← Back to API Key login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalPortal;
