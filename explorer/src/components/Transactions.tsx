
import React from 'react';
import {FileText} from 'lucide-react';

// Transactions Page
export const Transactions = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
              <p className="text-slate-500 mt-1">View and manage all transactions</p>
            </div>
          </div>
          <p className="text-slate-600">Transaction list and management interface would go here...</p>
        </div>
      </div>
    </div>
  );
};