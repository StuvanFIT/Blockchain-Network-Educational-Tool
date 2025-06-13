import React from 'react';

// 404 Not Found component
const NotFound = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
          <p className="text-slate-600 text-lg">Page not found</p>
          <a href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;