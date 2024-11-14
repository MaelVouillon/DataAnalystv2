import React from 'react';
import { Upload, FileText, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload Data */}
        <Link to="/import" className="group p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-100 hover:border-indigo-200 transition-all">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <Upload className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-medium text-gray-900">Importer des Données</h3>
              <p className="text-sm text-gray-500 mt-1">
                Importez vos données pour analyse
              </p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-indigo-600">
                <span>Commencer l'import</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* Generate Report */}
        <Link to="/reports" className="group p-4 bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100 hover:border-emerald-200 transition-all">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-medium text-gray-900">Générer un Rapport</h3>
              <p className="text-sm text-gray-500 mt-1">
                Créer un rapport d'analyse complet
              </p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-emerald-600">
                <span>Générer PDF</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* AI Predictions */}
        <button className="group p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100 hover:border-purple-200 transition-all relative">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900">Prédictions IA</h3>
                <span className="px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">Bientôt</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Obtenez des insights basés sur l'IA
              </p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-purple-600">
                <span>En savoir plus</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};