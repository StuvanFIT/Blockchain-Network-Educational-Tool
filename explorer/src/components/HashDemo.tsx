import React from 'react';
import { BarChart3 } from "lucide-react";

// Analytics Page
export const HashDemo = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
              <p className="text-slate-500 mt-1">Blockchain performance metrics</p>
            </div>
          </div>
          <p className="text-slate-600">Charts and analytics would be displayed here...</p>
        </div>
      </div>
    </div>
  );
};
