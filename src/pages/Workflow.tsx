import React, { useState } from 'react';
import { Plus, Search, Filter, BarChart2 } from 'lucide-react';
import { WorkflowList } from '../components/workflow/WorkflowList';
import { WorkflowBuilder } from '../components/workflow/WorkflowBuilder';
import { WorkflowTemplates } from '../components/workflow/WorkflowTemplates';
import { useWorkflowStore } from '../hooks/useWorkflowStore';

export const Workflow: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'error'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'executions' | 'name'>('date');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Workflows</p>
                <h3 className="text-2xl font-bold text-gray-900">24</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↑ 12% ce mois</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Actifs</p>
                <h3 className="text-2xl font-bold text-gray-900">18</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">75% du total</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Exécutions Aujourd'hui</p>
                <h3 className="text-2xl font-bold text-gray-900">156</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↑ 8% vs hier</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taux de Succès</p>
                <h3 className="text-2xl font-bold text-gray-900">98.5%</h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↑ 2% ce mois</span>
            </div>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un workflow..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="error">En erreur</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="date">Trier par date</option>
              <option value="executions">Trier par exécutions</option>
              <option value="name">Trier par nom</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
            >
              Modèles
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau Workflow</span>
            </button>
          </div>
        </div>

        {/* Contenu Principal */}
        {isCreating ? (
          <WorkflowBuilder onClose={() => setIsCreating(false)} />
        ) : showTemplates ? (
          <WorkflowTemplates 
            onUseTemplate={() => {
              setShowTemplates(false);
              setIsCreating(true);
            }} 
          />
        ) : (
          <WorkflowList
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            sortBy={sortBy}
          />
        )}
      </div>
    </div>
  );
};