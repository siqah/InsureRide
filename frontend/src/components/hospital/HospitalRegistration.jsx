import React, { useState } from 'react';
import { hospitalApi } from '../../api/hospitalApi';
import { ShieldCheckIcon, ClipboardIcon, KeyIcon } from '@heroicons/react/24/outline';

const HospitalRegistration = ({ onLoginWithKey }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registeredKey, setRegisteredKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRegisteredKey('');

    const trimmedPhone = phone.trim();
    if (!/^0\d{9}$/.test(trimmedPhone)) {
      setError('Phone number must be a valid 10-digit number starting with 0 (e.g., 0712345678)');
      setLoading(false);
      return;
    }

    try {
      const response = await hospitalApi.register(name.trim(), email.trim(), trimmedPhone);
      // Backend returns field 'apikey'
      if (response.data?.apikey) {
        setRegisteredKey(response.data.apikey);
      } else {
        setError('Hospital registered successfully, but no API key was returned.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (registeredKey) {
      navigator.clipboard.writeText(registeredKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 max-w-lg mx-auto shadow-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-lg text-primary mb-4">
          <ShieldCheckIcon className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-primary tracking-tight">Onboard Partner Hospital</h2>
        <p className="text-gray-500 font-semibold mt-1">Register to start verifying micro-insurance coverages</p>
      </div>

      {!registeredKey ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Hospital Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Memorial Hospital"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. contact@hospital.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0712345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3.5 rounded-lg font-bold transition-all tracking-wider text-sm uppercase
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 transform hover:scale-[1.01]'}
            `}
          >
            {loading ? 'Registering...' : 'Register Hospital'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-danger rounded-lg text-danger font-semibold text-sm">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-warning rounded-lg p-5">
            <h4 className="text-amber-900 font-bold flex items-center gap-1.5 mb-2">
              <KeyIcon className="h-5 w-5" />
              Save Your API Key!
            </h4>
            <p className="text-amber-800 text-sm font-semibold">
              Copy this API Key now. For security reasons, you will not be able to view it again.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={registeredKey}
              className="flex-1 bg-gray-50 border border-gray-300 px-4 py-3 rounded-lg font-mono text-sm text-primary select-all"
            />
            <button
              onClick={copyToClipboard}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors"
              title="Copy API Key"
            >
              <ClipboardIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {copied && (
            <p className="text-xs text-green-700 font-bold text-center">✓ Copied to clipboard</p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => onLoginWithKey(registeredKey)}
              className="w-full bg-success text-white py-3.5 rounded-lg font-bold hover:bg-green-700 transition-all uppercase text-sm tracking-wider"
            >
              Authenticate & Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalRegistration;
