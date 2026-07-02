import React, { useState, useEffect } from 'react';
import { CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated load from local storage or mock dataset
    const timer = setTimeout(() => {
      setClaims([
        {
          id: 1,
          workerName: 'John Kamau',
          workerPhone: '0712345678',
          amount: 2500.00,
          status: 'APPROVED',
          date: '2026-07-02T14:30:00'
        },
        {
          id: 2,
          workerName: 'Mary Wanjiru',
          workerPhone: '0723456789',
          amount: 1200.00,
          status: 'DENIED',
          date: '2026-07-02T13:15:00'
        },
        {
          id: 3,
          workerName: 'Peter Ochieng',
          workerPhone: '0734567890',
          amount: 3500.00,
          status: 'APPROVED',
          date: '2026-07-01T09:45:00'
        }
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredClaims = claims.filter(claim => {
    if (filter === 'ALL') return true;
    return claim.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12 bg-white rounded-xl border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xl font-black text-primary">Recent Claims Log</h3>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-4 w-4 text-gray-400" />
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            {['ALL', 'APPROVED', 'DENIED'].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                  filter === opt
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-primary'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredClaims.length === 0 ? (
        <p className="text-gray-500 text-center py-8 font-semibold">No claims match the selected filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 text-sm text-gray-700 font-semibold flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    {new Date(claim.date).toLocaleDateString()} {new Date(claim.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="py-3.5 px-4 text-sm">
                    <div className="font-bold text-primary">{claim.workerName}</div>
                    <div className="text-xs text-gray-500 font-semibold">{claim.workerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-black text-primary">
                    KES {claim.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-sm">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xxs font-black uppercase tracking-wider text-white ${
                      claim.status === 'APPROVED' 
                        ? 'bg-success' 
                        : 'bg-danger'
                    }`}>
                      {claim.status}
                    </span>
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

export default ClaimHistory;
