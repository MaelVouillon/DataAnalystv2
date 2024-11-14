import React from 'react';
import { Play, Pause, Edit, Trash2, ExternalLink, ArrowRight, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkflowListProps {
  searchQuery: string;
  statusFilter: string;
  sortBy: string;
}

export const WorkflowList: React.FC<WorkflowListProps> = ({
  searchQuery,
  statusFilter,
  sortBy
}) => {
  const { workflows } = useWorkflowStore();
  const { toggleWorkflowStatus, deleteWorkflow } = useWorkflowExecution();

  // Filtrer et trier les workflows
  const filteredWorkflows = workflows
    .filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'executions':
          return b.runs - a.runs;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {filteredWorkflows.map((workflow) => (
        <div
          key={workflow.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-indigo-200 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {workflow.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                  {workflow.status === 'active' ? 'Actif' : 
                   workflow.status === 'inactive' ? 'Inactif' : 'Erreur'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{workflow.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleWorkflowStatus(workflow.id)}
                className={`p-2 rounded-lg ${
                  workflow.status === 'active'
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={workflow.status === 'active' ? 'Désactiver' : 'Activer'}
              >
                {workflow.status === 'active' ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              <button 
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button 
                onClick={() => deleteWorkflow(workflow.id)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Workflow Steps Visualization */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm">
              {workflow.trigger.type}
            </div>
            {workflow.steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600 text-sm">
                  {step.type}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Statistiques et Dernière Exécution */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${
                  workflow.success / workflow.runs > 0.9 
                    ? 'bg-green-500' 
                    : workflow.success / workflow.runs > 0.7 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {workflow.success} succès sur {workflow.runs} exécutions
                </span>
              </div>
              {workflow.lastRun && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ExternalLink className="h-4 w-4" />
                  <span>
                    Dernière exécution: {format(new Date(workflow.lastRun), 'PPp', { locale: fr })}
                  </span>
                </div>
              )}
            </div>

            {workflow.status === 'error' && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Erreur lors de la dernière exécution</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchQuery
              ? 'Aucun workflow ne correspond à votre recherche'
              : 'Aucun workflow créé pour le moment'}
          </p>
        </div>
      )}
    </div>
  );
};