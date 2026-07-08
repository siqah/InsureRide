import React, { useState, useEffect } from 'react';
import { useWorkerStore } from '../../store/workerStore';
import CoverageCard from './CoverageCard';
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';
import { UserPlusIcon, KeyIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const WorkerDashboard = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [mode, setMode] = useState('login'); // 'login', 'register', or 'registered'
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [newWorkerPin, setNewWorkerPin] = useState('');
  const [localError, setLocalError] = useState('');

  const { 
    worker, 
    isAuthenticated,
    loading, 
    error, 
    loginWorker, 
    registerWorker, 
    logoutWorker, 
    clearWorker 
  } = useWorkerStore();

  useEffect(() => {
    return () => {
      clearWorker();
    };
  }, [clearWorker]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const trimmedPhone = phoneNumber.trim();
    const trimmedPin = pin.trim();

    if (!trimmedPhone || !trimmedPin) {
      setLocalError('Phone number and PIN are required');
      return;
    }

    if (!/^0\d{9}$/.test(trimmedPhone)) {
      setLocalError('Phone number must be a valid 10-digit number starting with 0');
      return;
    }

    if (!/^\d{4}$/.test(trimmedPin)) {
      setLocalError('PIN must be exactly 4 digits');
      return;
    }

    try {
      await loginWorker(trimmedPhone, trimmedPin);
    } catch (err) {
      // Error message is handled in store
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const trimmedName = registerName.trim();
    const trimmedPhone = registerPhone.trim();

    if (!trimmedName || !trimmedPhone) {
      setLocalError('Full name and phone number are required');
      return;
    }

    if (!/^0\d{9}$/.test(trimmedPhone)) {
      setLocalError('Phone number must be a valid 10-digit number starting with 0');
      return;
    }

    try {
      const response = await registerWorker(trimmedName, trimmedPhone);
      if (response && response.pin) {
        setNewWorkerPin(response.pin);
        setMode('registered');
        // Clear registration fields
        setRegisterName('');
        setRegisterPhone('');
      } else {
        setLocalError('Registration succeeded, but no PIN was returned.');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed. Please check details.');
    }
  };

  const activeError = localError || error;

  if (isAuthenticated && worker) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">🛵 Rider Portal</h1>
            <p className="text-gray-500 font-semibold mt-1">Manage coverage and daily premium payments</p>
          </div>
          <button
            onClick={logoutWorker}
            className="inline-flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-300 transition-colors text-sm uppercase"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            Log Out
          </button>
        </div>

        <div className="space-y-6">
          <CoverageCard worker={worker} />
          <PaymentForm phoneNumber={worker.phoneNumber} />
          <PaymentHistory phoneNumber={worker.phoneNumber} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {mode === 'login' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 max-w-md mx-auto shadow-sm w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-lg text-primary mb-4">
              <KeyIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Rider Sign In</h2>
            <p className="text-gray-500 font-semibold mt-1">Authenticate using your phone number and PIN</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">4-Digit PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="xxxx"
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono tracking-widest text-center text-lg font-bold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-lg font-bold hover:bg-opacity-90 transition-all uppercase text-sm tracking-wider disabled:opacity-50"
            >
              {loading ? 'Verifying PIN...' : 'Verify & Enter'}
            </button>

            {activeError && (
              <div className="mt-4 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold text-sm">
                {activeError}
              </div>
            )}
          </form>

          <div className="border-t border-gray-200 pt-6 mt-6 text-center">
            <p className="text-sm font-semibold text-gray-500">
              New rider?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setLocalError('');
                }}
                className="text-primary hover:underline font-bold"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      )}

      {mode === 'register' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 max-w-md mx-auto shadow-sm w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-lg text-primary mb-4">
              <UserPlusIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Rider Registration</h2>
            <p className="text-gray-500 font-semibold mt-1">Register to start managing daily coverage</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="e.g. John Kamau"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="text"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-lg font-bold hover:bg-opacity-90 transition-all uppercase text-sm tracking-wider disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Rider'}
            </button>

            {activeError && (
              <div className="mt-4 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold text-sm">
                {activeError}
              </div>
            )}
          </form>

          <div className="border-t border-gray-200 pt-6 mt-6 text-center">
            <p className="text-sm font-semibold text-gray-500">
              Already registered?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setLocalError('');
                }}
                className="text-primary hover:underline font-bold"
              >
                Log in here
              </button>
            </p>
          </div>
        </div>
      )}

      {mode === 'registered' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 max-w-md mx-auto shadow-sm w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-lg text-success mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Rider Registered!</h2>
            <p className="text-gray-500 font-semibold mt-1">Save your access PIN. You will not see it again.</p>
          </div>

          <div className="bg-amber-50 border border-warning rounded-lg p-5 mb-6 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-2">Your Login PIN</span>
            <span className="text-4xl font-black text-primary tracking-widest font-mono select-all block bg-white border border-gray-300 py-3 rounded-lg">
              {newWorkerPin}
            </span>
          </div>

          <button
            onClick={() => {
              setMode('login');
              setPhoneNumber(registerPhone);
              setLocalError('');
            }}
            className="w-full bg-success text-white py-3.5 rounded-lg font-bold hover:bg-green-700 transition-all uppercase text-sm tracking-wider"
          >
            Proceed to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
