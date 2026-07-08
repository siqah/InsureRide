import React, { useState, useEffect } from 'react';
import { useClaimStore } from '../../store/claimStore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const ClaimVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [localError, setLocalError] = useState('');
  const { verificationResult, loading, error, verifyClaim, clearVerificationResult } = useClaimStore();

  useEffect(() => {
    return () => {
      clearVerificationResult();
    };
  }, [clearVerificationResult]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError('');
    const trimmedPhone = phoneNumber.trim();
    if (!/^0\d{9}$/.test(trimmedPhone)) {
      setLocalError('Phone number must be a valid 10-digit number starting with 0 (e.g., 0712345678)');
      return;
    }
    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      setLocalError('Bill amount must be greater than zero');
      return;
    }
    try {
      await verifyClaim(trimmedPhone, amount);
    } catch {
      // Handled in store
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="h-8 w-8 text-primary mr-3" />
        <h2 className="text-2xl font-black text-primary tracking-tight">Verify Patient Coverage</h2>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Patient Phone Number *
            </label>
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
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Bill Amount (KES) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1500.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary text-white py-3.5 rounded-lg font-bold transition-all tracking-wider text-sm uppercase
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 transform hover:scale-[1.01]'}
          `}
        >
          {loading ? 'Verifying...' : 'Verify Coverage'}
        </button>
      </form>

      {(localError || error) && (
        <div className="mt-6 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold">
          {localError || error}
        </div>
      )}

      {verificationResult && (
        <div className={`mt-6 p-6 rounded-lg border-2 ${
          verificationResult.isCovered 
            ? 'border-success bg-green-50' 
            : 'border-danger bg-red-50'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-primary">
                {verificationResult.workerName} ({verificationResult.workerPhone})
              </h3>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-black uppercase tracking-wider text-white ${
                  verificationResult.isCovered 
                    ? 'bg-success' 
                    : 'bg-danger'
                }`}>
                  {verificationResult.isCovered ? (
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 mr-1.5" />
                  )}
                  {verificationResult.status}
                </span>
              </div>
              <p className={`mt-2 font-semibold ${verificationResult.isCovered ? 'text-green-900' : 'text-red-900'}`}>
                {verificationResult.message}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bill Amount</p>
              <p className="text-2xl font-black text-primary">KES {parseFloat(amount).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimVerification;
