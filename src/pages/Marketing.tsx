import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Brain, AlertTriangle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCategorizedData } from '../hooks/useCategorizedData';
import { DataSet } from '../types';
import { AIInsights } from '../components/AIInsights';
import { ChatInterface } from '../components/ChatInterface';

const defaultCampaignData = Array.from({ length: 12 }, (_, i) => ({
  mois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i],
  engagement: Math.floor(70 + Math.random() * 30),
  conversions: Math.floor(40 + Math.random() * 20)
}));

const defaultAudienceData = Array.from({ length: 12 }, (_, i) => ({
  mois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i],
  visiteurs: Math.floor(10000 + Math.random() * 5000),
  nouveauxClients: Math.floor(2000 + Math.random() * 1000)
}));

const generateDataFromDataset = (dataset: DataSet | undefined) => {
  if (!dataset?.data) {
    return {
      campaignData: defaultCampaignData,
      audienceData: defaultAudienceData
    };
  }

  const data = Array.isArray(dataset.data) ? dataset.data : [];
  
  const campaignData = data.map((row: any) => ({
    mois: row.month || row.date || row.periode,
    engagement: parseFloat(row.engagement || row.interaction || 0),
    conversions: parseFloat(row.conversions || row.conversion || 0)
  })).filter(item => !isNaN(item.engagement) && !isNaN(item.conversions));

  const audienceData = data.map((row: any) => ({
    mois: row.month || row.date || row.periode,
    visiteurs: parseFloat(row.visitors || row.visiteurs || row.audience || 0),
    nouveauxClients: parseFloat(row.new_customers || row.nouveaux_clients || 0)
  })).filter(item => !isNaN(item.visiteurs) && !isNaN(item.nouveauxClients));

  return {
    campaignData: campaignData.length > 0 ? campaignData : defaultCampaignData,
    audienceData: audienceData.length > 0 ? audienceData : defaultAudienceData
  };
};

export const Marketing: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const { latestDataset, hasData, error } = useCategorizedData('marketing');
  const { campaignData, audienceData } = generateDataFromDataset(latestDataset);

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-6 w-6 text-red-500 mx-auto" />
        <p className="text-red-700 mt-4">Erreur lors du chargement des données.</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Aucune donnée disponible. Veuillez importer des données marketing.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
            <p className="text-gray-500">Performance des campagnes et engagement client</p>
          </div>
          <button 
            onClick={() => setShowChatbot(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Brain className="h-5 w-5" />
            <span>Analyse IA</span>
          </button>
        </div>

        {/* KPIs et Graphiques */}
        {hasData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="flex justify-between items-center">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-100">+24%</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">89%</h3>
                <p className="text-sm text-white/80">Taux d'Engagement</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl text-white">
                <div className="flex justify-between items-center">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-100">+18%</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">€45,280</h3>
                <p className="text-sm text-white/80">ROI Campagnes</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
                <div className="flex justify-between items-center">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-100">+32%</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">12,458</h3>
                <p className="text-sm text-white/80">Nouveaux Clients</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Campagnes</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={campaignData}>
                      <defs>
                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Area 
                        type="monotone" 
                        dataKey="engagement" 
                        name="Engagement"
                        stroke="#8B5CF6" 
                        fillOpacity={1} 
                        fill="url(#colorEngagement)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="conversions" 
                        name="Conversions"
                        stroke="#EC4899" 
                        fillOpacity={0.5} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance de l'Audience</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audienceData}>
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey="visiteurs" name="Visiteurs" fill="#8B5CF6" />
                      <Bar dataKey="nouveauxClients" name="Nouveaux Clients" fill="#EC4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Chatbot */}
        {showChatbot && (
          <div className="mt-6">
            <ChatInterface category="marketing" onClose={() => setShowChatbot(false)} />
          </div>
        )}
      </div>
    </div>
  );
};