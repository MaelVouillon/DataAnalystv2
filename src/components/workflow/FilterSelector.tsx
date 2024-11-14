import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { WorkflowFilter, WorkflowTriggerType, WorkflowStep } from '../../types/workflow';
import { v4 as uuidv4 } from 'uuid';

interface FilterSelectorProps {
  trigger: string | null;
  steps: WorkflowStep[];
  onComplete: (filters: WorkflowFilter[]) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  trigger,
  steps,
  onComplete
}) => {
  const [filters, setFilters] = useState<WorkflowFilter[]>([]);

  const addFilter = () => {
    const newFilter: WorkflowFilter = {
      id: uuidv4(),
      field: '',
      operator: 'contains',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<WorkflowFilter>) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  const handleComplete = () => {
    onComplete(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Configurer les filtres
        </h3>
        <button
          onClick={addFilter}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un filtre</span>
        </button>
      </div>

      <div className="space-y-4">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <select
              value={filter.field}
              onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner un champ</option>
              <option value="subject">Objet</option>
              <option value="sender">Expéditeur</option>
              <option value="content">Contenu</option>
            </select>

            <select
              value={filter.operator}
              onChange={(e) => updateFilter(filter.id, { operator: e.target.value as WorkflowFilter['operator'] })}
              className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="contains">Contient</option>
              <option value="equals">Est égal à</option>
              <option value="starts">Commence par</option>
              <option value="ends">Se termine par</option>
            </select>

            <input
              type="text"
              value={filter.value}
              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
              placeholder="Valeur"
              className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />

            <button
              onClick={() => removeFilter(filter.id)}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}

        {filters.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">
              Aucun filtre configuré. Ajoutez des filtres pour affiner le déclenchement du workflow.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Terminer la configuration
        </button>
      </div>
    </div>
  );
};