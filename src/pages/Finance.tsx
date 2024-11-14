import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, Brain } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCategorizedData } from '../hooks/useCategorizedData';
import { AIInsights } from '../components/AIInsights';
import { mapDataForCategory } from '../utils/dataMapping';
import { ChatInterface } from '../components/ChatInterface';

export const Finance: React.FC = () => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const { latestDataset, hasData } = useCategorizedData('finance');

  // Mappage des données uniquement si latestDataset existe
  const mappedData = latestDataset ? mapDataForCategory(latestDataset, 'finance') : null;

  console.log('Latest Dataset:', latestDataset);
  console.log('Mapped Data:', mappedData);

  // Définir les données ou les valeurs actuelles uniquement si mappedData est disponible
  const cashFlowData = mappedData?.cashFlowData || [];
  const revenueData = mappedData?.revenueData || [];

  console.log('Cash Flow Data:', cashFlowData);
  console.log('Revenue Data:', revenueData);

  const currentCashFlow = cashFlowData.length > 0 ? cashFlowData[cashFlowData.length - 1].value : 0;
  const currentRevenue = revenueData.length > 0 ? revenueData[revenueData.length - 1].income : 0;
  const currentExpenses = revenueData.length > 0 ? revenueData[revenueData.length - 1].expenses : 0;

  // Calcul des croissances uniquement si les données nécessaires existent
  const cashFlowGrowth = cashFlowData.length > 1
    ? ((cashFlowData[cashFlowData.length - 1].value / cashFlowData[cashFlowData.length - 2].value) - 1) * 100
    : 0;
  const revenueGrowth = revenueData.length > 1
    ? ((revenueData[revenueData.length - 1].income / revenueData[revenueData.length - 2].income) - 1) * 100
    : 0;
  const expensesGrowth = revenueData.length > 1
    ? ((revenueData[revenueData.length - 1].expenses / revenueData[revenueData.length - 2].expenses) - 1) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
            <p className="text-gray-500">Gestion financière et prévisions</p>
          </div>
          <button 
            onClick={() => setShowChatbot(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Brain className="h-5 w-5" />
            <span>Analyse IA</span>
          </button>
        </div>

        {/* Message "Fonctionnalité à venir" */}
        {showComingSoon && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg">
            <p>La fonctionnalité Analyse IA arrivera bientôt !</p>
            <button 
              onClick={() => setShowComingSoon(false)}
              className="mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Vérifier si les données existent */}
        {mappedData ? (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-100">
                    {cashFlowGrowth > 0 ? '+' : ''}{cashFlowGrowth.toFixed(1)}%
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">€{currentCashFlow.toLocaleString()}</h3>
                <p className="text-sm text-white/80">Trésorerie</p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-100">
                    {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">€{currentRevenue.toLocaleString()}</h3>
                <p className="text-sm text-white/80">Chiffre d'Affaires</p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-red-100">
                    {expensesGrowth > 0 ? '+' : ''}{expensesGrowth.toFixed(1)}%
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">€{currentExpenses.toLocaleString()}</h3>
                <p className="text-sm text-white/80">Dépenses</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Flow Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution de la Trésorerie</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <defs>
                        <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        fillOpacity={1} 
                        fill="url(#colorCashFlow)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenus vs Dépenses */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus vs Dépenses</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey="income" name="Revenus" fill="#10B981" />
                      <Bar dataKey="expenses" name="Dépenses" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI Panel */}
            {showAIPanel && <AIInsights category="finance" />}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Aucune donnée importée. Veuillez importer vos données financières pour afficher les informations.</p>
          </div>
        )}

        {/* Chatbot */}
        {showChatbot && (
          <div className="mt-6">
            <ChatInterface category="finance" onClose={() => setShowChatbot(false)} />
          </div>
        )}
      </div>
    </div>
  );
};