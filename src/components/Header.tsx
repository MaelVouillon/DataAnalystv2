import React, { useState } from 'react';
import { Search, BarChart2, User, Bell, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <BarChart2 className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">DataSense</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/finance" className="text-gray-600 hover:text-indigo-600 font-medium">Finance</Link>
              <Link to="/marketing" className="text-gray-600 hover:text-indigo-600 font-medium">Marketing</Link>
              <Link to="/sales" className="text-gray-600 hover:text-indigo-600 font-medium">Sales</Link>
              <Link to="/workflow" className="text-gray-600 hover:text-indigo-600 font-medium">Workflow</Link>
            </nav>
          </div>

          {/* Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything..."
                className="w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};