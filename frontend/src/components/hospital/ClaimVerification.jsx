import React, { useState } from 'react';
import { claimApi } from '../../api/claimApi';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const ClaimVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await claimApi.verify(phoneNumber, parseFloat(amount));
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Make sure your API Key is valid.');
    } finally {
      setLoading(false);
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

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold">
          {error}
        </div>
      )}

      {result && (
        <div className={`mt-6 p-6 rounded-lg border-2 ${
          result.isCovered 
            ? 'border-success bg-green-50' 
            : 'border-danger bg-red-50'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-primary">
                {result.workerName} ({result.workerPhone})
              </h3>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-black uppercase tracking-wider text-white ${
                  result.isCovered 
                    ? 'bg-success' 
                    : 'bg-danger'
                }`}>
                  {result.isCovered ? (
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 mr-1.5" />
                  )}
                  {result.status}
                </span>
              </div>
              <p className={`mt-2 font-semibold ${result.isCovered ? 'text-green-900' : 'text-red-900'}`}>
                {result.message}
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
