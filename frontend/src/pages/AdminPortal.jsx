import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { 
  UsersIcon, 
  ArrowRightOnRectangleIcon, 
  ShieldCheckIcon, 
  ClipboardDocumentCheckIcon, 
  CreditCardIcon, 
  KeyIcon 
} from '@heroicons/react/24/outline';

const AdminPortal = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('workers'); // 'workers', 'claims', or 'payments'

  const {
    isAuthenticated,
    loading,
    error,
    workers,
    claims,
    payments,
    loginAdmin,
    logoutAdmin,
    fetchWorkers,
    updateWorkerStatus,
    fetchClaims,
    fetchPayments
  } = useAdminStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkers();
      fetchClaims();
      fetchPayments();
    }
  }, [isAuthenticated, fetchWorkers, fetchClaims, fetchPayments]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(usernameInput.trim(), passwordInput);
    } catch {
      // Handled in store
    }
  };

  const handleToggleWorkerStatus = async (workerId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await updateWorkerStatus(workerId, nextStatus);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 max-w-md mx-auto shadow-sm w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-lg text-danger mb-4">
              <KeyIcon className="h-8 w-8 text-danger" />
            </div>
            <h2 className="text-2xl font-black text-primary tracking-tight">System Admin Access</h2>
            <p className="text-gray-500 font-semibold mt-1">Authenticate using administrator credentials</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-danger text-white py-3.5 rounded-lg font-bold hover:bg-opacity-90 transition-all uppercase text-sm tracking-wider disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto flex-1">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">👑 System Admin Console</h1>
          <p className="text-gray-500 font-semibold mt-1">Global audit logs, rider management, and status overrides</p>
        </div>
        <button
          onClick={logoutAdmin}
          className="inline-flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-300 transition-colors text-sm uppercase"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Log Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('workers')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all ${
            activeTab === 'workers' 
              ? 'border-primary text-primary bg-blue-50/50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <UsersIcon className="h-5 w-5" />
          Riders List ({workers.length})
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all ${
            activeTab === 'claims' 
              ? 'border-primary text-primary bg-blue-50/50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ClipboardDocumentCheckIcon className="h-5 w-5" />
          Claim Audits ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all ${
            activeTab === 'payments' 
              ? 'border-primary text-primary bg-blue-50/50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <CreditCardIcon className="h-5 w-5" />
          Payment logs ({payments.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {activeTab === 'workers' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Rider Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Coverage</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {workers.map((rider) => (
                  <tr key={rider.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{rider.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{rider.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">{rider.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-black uppercase tracking-wider text-white rounded ${
                        rider.coverageStatus === 'ACTIVE' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {rider.coverageStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">
                      {rider.coverageExpiry ? new Date(rider.coverageExpiry).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleWorkerStatus(rider.id, rider.coverageStatus)}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded border transition-colors ${
                          rider.coverageStatus === 'ACTIVE' 
                            ? 'border-danger text-danger bg-red-50 hover:bg-danger hover:text-white' 
                            : 'border-success text-success bg-green-50 hover:bg-success hover:text-white'
                        }`}
                      >
                        {rider.coverageStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {workers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm font-semibold text-gray-500">No riders registered.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Worker ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Hospital ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Rejection Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{claim.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">{claim.workerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">{claim.hospitalId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">KES {claim.claimAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-black uppercase tracking-wider text-white rounded ${
                        claim.claimStatus === 'APPROVED' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {claim.claimStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-danger">
                      {claim.rejectionReason || '—'}
                    </td>
                  </tr>
                ))}
                {claims.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm font-semibold text-gray-500">No audited claims found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Worker ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Tx Reference</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payments.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{pmt.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">{pmt.workerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">KES {pmt.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-primary">{pmt.transactionReference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">
                      {new Date(pmt.paymentDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm font-semibold text-gray-500">No payment logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
