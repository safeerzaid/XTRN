import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center font-nav">
      <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-black mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-black mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-500 max-w-md mx-auto mb-10 text-[15px]">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-8 py-3.5 bg-black text-white text-[13px] font-bold uppercase tracking-[0.1em] hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
