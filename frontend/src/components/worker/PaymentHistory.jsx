import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../api/paymentApi';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const PaymentHistory = ({ phoneNumber }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phoneNumber) {
      fetchPaymentHistory();
    }
  }, [phoneNumber]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await paymentApi.getWorkerPayments(phoneNumber);
      setPayments(response.data);
    } catch (err) {
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-xl border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-primary">Payment History</h3>
        <button
          onClick={fetchPaymentHistory}
          className="text-primary hover:text-secondary transition-colors"
          title="Refresh History"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold text-sm">
          {error}
        </div>
      )}

      {payments.length === 0 ? (
        <p className="text-gray-500 text-center py-8 font-semibold">No payments recorded yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 text-sm text-gray-700 font-semibold">
                    {new Date(payment.paymentDate).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-sm font-black text-success">
                    KES {payment.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700 font-mono">
                    {payment.transactionReference || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
