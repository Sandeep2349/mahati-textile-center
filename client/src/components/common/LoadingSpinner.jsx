import React from 'react';

const LoadingSpinner = ({ text = 'Loading catalog...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-10 h-10 border-3 border-red-200 border-t-red-800 rounded-full animate-spin mb-3"></div>
      <p className="text-xs text-slate-500 font-medium tracking-wide">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
