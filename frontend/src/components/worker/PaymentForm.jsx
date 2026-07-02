import React, { useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import { CurrencyDollarIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const PaymentForm = ({ phoneNumber, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(20);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const txRef = reference || `MPESA-${Date.now()}`;
      
      const response = await paymentApi.processPayment(
        phoneNumber,
        amount,
        txRef
      );

      setSuccess(`✅ ${response.data.message}`);
      setReference('');
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-black text-primary mb-6 flex items-center">
        <CurrencyDollarIcon className="h-6 w-6 text-success mr-2" />
        Pay Daily Premium (20 KES)
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Amount (KES)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
                step="0.01"
                min="20"
                required
              />
              <span className="absolute right-3 top-3 text-gray-400 font-bold">KES</span>
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-1">Standard premium: 20.00 KES</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Transaction Reference (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. MPESA-ABC123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
              />
              <CreditCardIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-1">Auto-generated if left blank</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 bg-success text-white py-3.5 rounded-lg font-bold transition-all tracking-wider text-sm uppercase
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700 transform hover:scale-[1.01]'}
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Pay Premium Now'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-success rounded-lg text-green-800 font-semibold">
            {success}
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
