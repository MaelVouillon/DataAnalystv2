import React from 'react';
import { AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

export const AlertSection: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Alerts & Recommendations</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">AI-Powered Insights</span>
          <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">Coming Soon</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Critical Alert */}
        <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-900">Cash Flow Alert</h3>
            <p className="text-sm text-red-700 mt-1">
              Current cash reserves are below target. Consider reviewing upcoming expenses.
            </p>
            <button className="mt-2 flex items-center space-x-2 text-sm text-red-600 hover:text-red-700">
              <span>View Recommendations</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-900">Marketing Opportunity</h3>
            <p className="text-sm text-amber-700 mt-1">
              Customer engagement peaks detected. Consider launching a targeted campaign.
            </p>
            <button className="mt-2 flex items-center space-x-2 text-sm text-amber-600 hover:text-amber-700">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};