
import React from 'react';
import { Home } from 'lucide-react';

// Dashboard Page
export const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome to your blockchain dashboard</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <h3 className="font-semibold text-blue-800">Total Blocks</h3>
              <p className="text-2xl font-bold text-blue-900 mt-2">1,234</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <h3 className="font-semibold text-green-800">Transactions</h3>
              <p className="text-2xl font-bold text-green-900 mt-2">56,789</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <h3 className="font-semibold text-purple-800">Active Users</h3>
              <p className="text-2xl font-bold text-purple-900 mt-2">2,456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};