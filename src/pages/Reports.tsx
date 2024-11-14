import React, { useState } from 'react';
import { FileText, Download, Brain, AlertTriangle, ArrowRight, PieChart } from 'lucide-react';
import { AreaChart, Area, PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Données de démonstration
const performanceData = Array.from({ length: 12 }, (_, i) => ({
  mois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i],
  roi: Math.floor(15 + Math.random() * 10),
  engagement: Math.floor(60 + Math.random() * 20)
}));

const channelData = [
  { name: 'Email', value: 35 },
  { name: 'Social Media', value: 25 },
  { name: 'SEO', value: 20 },
  { name: 'PPC', value: 15 },
  { name: 'Autres', value: 5 }
];

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];

export const Reports: React.FC = () => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    const element = document.getElementById('report-content');
    if (!element) {
      setGenerating(false);
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('rapport-marketing.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6" id="report-content">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Génération de Rapports</h1>
            <p className="text-gray-500">Analysez et exportez vos données marketing</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Brain className="h-5 w-5" />
              <span>Analyse IA</span>
            </button>
            <button
              onClick={generatePDF}
              disabled={generating}
              className={`flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${
                generating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download className="h-5 w-5" />
              <span>{generating ? 'Génération...' : 'Exporter PDF'}</span>
            </button>
          </div>
        </div>

        {/* Performance Marketing */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Marketing</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorROI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="roi"
                  name="ROI (%)"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorROI)"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  name="Engagement (%)"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution des Canaux */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Distribution des Canaux Marketing</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panneau IA - Lucie */}
        {showAIPanel && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Lucie - Votre Assistante Marketing IA</h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                Version Beta
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <AlertTriangle className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-indigo-900">Analyse des Canaux</h4>
                  <p className="text-sm text-indigo-700 mt-1">
                    L'email marketing montre le meilleur ROI à 35%. Considérez augmenter 
                    l'investissement dans ce canal tout en optimisant les campagnes sociales.
                  </p>
                  <button className="mt-2 flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700">
                    <span>Voir l'analyse détaillée</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Fonctionnalités à venir :</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>Analyse prédictive des tendances</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>Recommandations personnalisées par segment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>Optimisation automatique des budgets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};