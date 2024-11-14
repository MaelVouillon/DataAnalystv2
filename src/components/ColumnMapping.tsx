import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { ColumnMapping as IColumnMapping } from '../types/mapping';

interface ColumnMappingProps {
  columns: string[];
  mappings: IColumnMapping[];
  onMappingChange: (columnName: string, mapping: Partial<IColumnMapping>) => void;
}

export const ColumnMapping: React.FC<ColumnMappingProps> = ({
  columns,
  mappings,
  onMappingChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Configuration des Colonnes</h3>
        <span className="text-sm text-gray-500">
          {mappings.filter(m => m.validated).length} / {columns.length} colonnes configurées
        </span>
      </div>

      <div className="grid gap-4">
        {columns.map((column, columnIndex) => {
          const mapping = mappings.find(m => m.name === column) || {
            name: column,
            type: 'text',
            validated: false
          };

          return (
            <div
              key={`${column}-${columnIndex}`}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {mapping.validated ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="font-medium text-gray-900">{column}</span>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={mapping.type}
                  onChange={(e) => onMappingChange(column, { 
                    type: e.target.value as IColumnMapping['type'],
                    validated: true
                  })}
                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="text">Texte</option>
                  <option value="number">Nombre</option>
                  <option value="date">Date</option>
                  <option value="boolean">Booléen</option>
                  <option value="currency">Devise</option>
                </select>

                {mapping.type === 'date' && (
                  <select
                    value={mapping.format || 'DD/MM/YYYY'}
                    onChange={(e) => onMappingChange(column, { format: e.target.value })}
                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                )}

                {mapping.type === 'currency' && (
                  <select
                    value={mapping.format || 'EUR'}
                    onChange={(e) => onMappingChange(column, { format: e.target.value })}
                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};