import React from 'react';
import { BarChart2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">DataSense</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">© 2024 DataSense. All rights reserved.</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-indigo-600">More Features</span>
              <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};