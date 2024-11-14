import React from 'react';
import { LineChart, TrendingUp, Users, DollarSign, Target, BarChart2, ArrowRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockData = Array.from({ length: 12 }, (_, i) => ({
  name: i.toString(),
  value: Math.floor(Math.random() * 100)
}));

export const DomainCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Finance Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Finance</h3>
            </div>
            <span className="text-sm text-emerald-600 font-medium">+12.5%</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Current Cash Flow</p>
              <p className="text-2xl font-bold text-gray-900">€84,254.00</p>
            </div>

            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorFinance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button className="mt-4 flex items-center space-x-2 text-sm text-emerald-600 hover:text-emerald-700">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Marketing Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Marketing</h3>
            </div>
            <span className="text-sm text-purple-600 font-medium">+8.2%</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Campaign Performance</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
            </div>

            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorMarketing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorMarketing)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button className="mt-4 flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sales Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sales</h3>
            </div>
            <span className="text-sm text-blue-600 font-medium">+15.8%</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">€142,384</p>
            </div>

            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#2563EB" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button className="mt-4 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};