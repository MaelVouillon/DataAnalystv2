import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Save, Trash2 } from 'lucide-react';
import { ColumnMapping, DataMapping } from '../types/mapping';
import { useMappingStore } from '../hooks/useMappingStore';

interface DataMappingProps {
  data: any[];
  onMappingComplete: (mapping: ColumnMapping[]) => void;
}

export const DataMappingComponent: React.FC<DataMappingProps> = ({ data, onMappingComplete }) => {
  const [columns, setColumns] = useState<ColumnMapping[]>([]);
  const [mappingName, setMappingName] = useState('');
  const { addMapping, findSimilarMapping, deleteMapping } = useMappingStore();
  const [similarMapping, setSimilarMapping] = useState<DataMapping | null>(null);

  useEffect(() => {
    if (data.length > 0) {
      const columnNames = Object.keys(data[0]);
      const existingMapping = findSimilarMapping(columnNames);
      setSimilarMapping(existingMapping);

      if (existingMapping) {
        setColumns(existingMapping.columns);
        setMappingName(existingMapping.name);
      } else {
        setColumns(
          columnNames.map((name) => ({
            name,
            type: 'text',
            validated: false,
          }))
        );
      }
    }
  }, [data, findSimilarMapping]);

  const handleTypeChange = (columnName: string, type: ColumnMapping['type']) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.name === columnName
          ? { ...col, type, validated: true }
          : col
      )
    );
  };

  const handleSaveMapping = () => {
    if (!mappingName.trim()) {
      alert('Veuillez donner un nom à ce mapping');
      return;
    }

    addMapping({
      name: mappingName,
      columns: columns,
    });

    onMappingComplete(columns);
  };

  const handleDeleteMapping = () => {
    if (similarMapping) {
      deleteMapping(similarMapping.id);
      setSimilarMapping(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Configuration des Colonnes</h3>
        {similarMapping && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Mapping similaire trouvé :</span>
            <span className="font-medium text-indigo-600">{similarMapping.name}</span>
            <button
              onClick={handleDeleteMapping}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="mappingName" className="block text-sm font-medium text-gray-700">
          Nom du Mapping
        </label>
        <input
          type="text"
          id="mappingName"
          value={mappingName}
          onChange={(e) => setMappingName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Ex: Mapping Finance 2024"
        />
      </div>

      <div className="space-y-4">
        {columns.map((column) => (
          <div
            key={column.name}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              {column.validated ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <span className="font-medium text-gray-900">{column.name}</span>
            </div>

            <select
              value={column.type}
              onChange={(e) => handleTypeChange(column.name, e.target.value as ColumnMapping['type'])}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="text">Texte</option>
              <option value="number">Nombre</option>
              <option value="date">Date</option>
              <option value="boolean">Booléen</option>
              <option value="currency">Devise</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveMapping}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Save className="h-5 w-5" />
          <span>Sauvegarder le Mapping</span>
        </button>
      </div>
    </div>
  );
};