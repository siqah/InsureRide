import React, { useState, useEffect } from 'react';
import { useWorkerStore } from '../../store/workerStore';
import CoverageCard from './CoverageCard';
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';
import { UserPlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const WorkerDashboard = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [localError, setLocalError] = useState('');
  const { worker, loading, error, fetchWorkerByPhone, registerWorker, clearWorker } = useWorkerStore();

  useEffect(() => {
    return () => {
      clearWorker();
    };
  }, [clearWorker]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLocalError('');
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      setLocalError('Phone number is required');
      return;
    }
    if (!/^0\d{9}$/.test(trimmedPhone)) {
      setLocalError('Phone number must be a valid 10-digit number starting with 0 (e.g., 0712345678)');
      return;
    }

    setShowRegister(false);
    try {
      await fetchWorkerByPhone(trimmedPhone);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 500) {
        setShowRegister(true);
      }
    }
  };

  const handleRegister = async () => {
    const name = prompt('Enter your full name:');
    if (name === null) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert('Name is required to register a worker.');
      return;
    }

    try {
      await registerWorker(trimmedName, phoneNumber.trim());
      setShowRegister(false);
      alert('✅ Registration successful! Now make your first payment.');
    } catch {
      // Handled in store
    }
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-black text-primary tracking-tight">🛵 Rider Coverage Portal</h1>
        <p className="text-gray-500 font-semibold mt-1">Check and pay premium micro-insurance daily coverage instantly</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number (e.g. 0712345678)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 tracking-wide"
          >
            {loading ? 'Searching...' : 'Check Coverage'}
          </button>
        </form>
      </div>

      {(localError || error) && (
        <div className="bg-amber-50 border border-warning rounded-xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-amber-900 font-bold">{localError || error}</p>
          </div>
          {showRegister && (
            <button
              onClick={handleRegister}
              className="inline-flex items-center bg-primary text-white px-4 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-colors shadow-sm text-sm"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Register Now
            </button>
          )}
        </div>
      )}

      {worker && (
        <div className="space-y-6">
          <CoverageCard worker={worker} />
          <PaymentForm 
            phoneNumber={phoneNumber} 
            onPaymentSuccess={() => fetchWorker(phoneNumber)}
          />
          <PaymentHistory phoneNumber={phoneNumber} />
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
