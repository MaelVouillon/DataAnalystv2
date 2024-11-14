import React, { useState } from 'react';
import { DollarSign, ShoppingCart, Users, Brain, AlertTriangle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCategorizedData } from '../hooks/useCategorizedData';
import { DataSet } from '../types';
import { AIInsights } from '../components/AIInsights';
import { ChatInterface } from '../components/ChatInterface';

const defaultSalesData = Array.from({ length: 12 }, (_, i) => ({
  mois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i],
  ventes: Math.floor(80000 + Math.random() * 40000),
  objectif: 100000
}));

const defaultCustomerData = Array.from({ length: 12 }, (_, i) => ({
  mois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i],
  satisfaction: Math.floor(85 + Math.random() * 10),
  retention: Math.floor(75 + Math.random() * 15)
}));

const generateDataFromDataset = (dataset: DataSet | undefined) => {
  if (!dataset?.data) {
    return {
      salesData: defaultSalesData,
      customerData: defaultCustomerData
    };
  }

  const data = Array.isArray(dataset.data) ? dataset.data : [];
  
  const salesData = data.map((row: any) => ({
    mois: row.month || row.date || row.periode,
    ventes: parseFloat(row.sales || row.ventes || row.revenue || 0),
    objectif: parseFloat(row.target || row.objectif || row.goal || 100000)
  })).filter(item => !isNaN(item.ventes));

  const customerData = data.map((row: any) => ({
    mois: row.month || row.date || row.periode,
    satisfaction: parseFloat(row.satisfaction || row.sat || 0),
    retention: parseFloat(row.retention || row.fidelite || 0)
  })).filter(item => !isNaN(item.satisfaction) && !isNaN(item.retention));

  return {
    salesData: salesData.length > 0 ? salesData : defaultSalesData,
    customerData: customerData.length > 0 ? customerData : defaultCustomerData
  };
};

export const Sales: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const { latestDataset, hasData } = useCategorizedData('sales');
  const { salesData, customerData } = generateDataFromDataset(latestDataset);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventes</h1>
            <p className="text-gray-500">Performance commerciale et satisfaction client</p>
          </div>
          <button 
            onClick={() => setShowChatbot(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Brain className="h-5 w-5" />
            <span>Analyse IA</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-100">+15.8%</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold">€142,384</h3>
            <p className="text-sm text-white/80">Chiffre d'Affaires</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center">
              <div className="p-2 bg-white/20 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-100">+22%</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold">1,284</h3>
            <p className="text-sm text-white/80">Commandes</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-100">+92%</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold">94%</h3>
            <p className="text-sm text-white/80">Satisfaction Client</p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Ventes</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Area 
                    type="monotone" 
                    dataKey="ventes" 
                    name="Ventes"
                    stroke="#2563EB" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="objectif" 
                    name="Objectif"
                    stroke="#059669" 
                    strokeDasharray="5 5"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction et Rétention</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerData}>
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="satisfaction" name="Satisfaction" fill="#2563EB" />
                  <Bar dataKey="retention" name="Rétention" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chatbot */}
        {showChatbot && (
          <div className="mt-6">
            <ChatInterface category="sales" onClose={() => setShowChatbot(false)} />
          </div>
        )}
      </div>
    </div>
  );
};