import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useCountdown } from '../../hooks/useCountdown';

const CoverageCard = ({ worker }) => {
  const { timeLeft, isExpired } = useCountdown(worker?.coverageExpiry);
  const isActive = worker?.coverageStatus === 'ACTIVE' && !isExpired;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-primary leading-tight">{worker?.name}</h2>
          <p className="text-gray-500 font-semibold">{worker?.phoneNumber}</p>
        </div>
        <div className="flex items-center">
          {isActive ? (
            <div className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span className="font-extrabold text-sm tracking-wider">ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center bg-danger text-white px-4 py-2 rounded-lg">
              <XCircleIcon className="h-6 w-6 mr-2" />
              <span className="font-extrabold text-sm tracking-wider">SUSPENDED</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-secondary mr-3" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Coverage Remaining</p>
              {isActive ? (
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-3xl font-black text-primary">
                    {timeLeft.hours}
                  </span>
                  <span className="text-gray-500 font-bold">h</span>
                  <span className="text-2xl font-bold text-primary">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-gray-500 font-bold">m</span>
                  <span className="text-xl font-bold text-primary">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-gray-500 font-bold">s</span>
                </div>
              ) : (
                <p className="text-xl font-extrabold text-danger mt-1">No active coverage</p>
              )}
            </div>
          </div>
          {isActive && timeLeft.days > 0 && (
            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Days</p>
              <p className="text-2xl font-black text-primary">{timeLeft.days}</p>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isActive ? 'bg-success' : 'bg-danger'
            }`}
            style={{
              width: isActive 
                ? `${Math.min(100, (timeLeft.total / 86400000) * 100)}%` 
                : '0%'
            }}
          />
        </div>
        <p className="text-xs font-bold text-gray-400 mt-2">
          Expires: {worker?.coverageExpiry ? new Date(worker.coverageExpiry).toLocaleString() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default CoverageCard;
