import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileType, AlertTriangle } from 'lucide-react';
import { useDataStore } from '../hooks/useDataStore';
import { processFile } from '../utils/fileProcessing';
import { DataSet } from '../types';

const categories = [
  { id: 'finance', label: 'Finance' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Ventes' }
];

export const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDataset, setActiveDataset } = useDataStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleFiles = useCallback(async (files: FileList) => {
    try {
      if (selectedCategories.length === 0) {
        setError('Veuillez sélectionner au moins une catégorie');
        return;
      }

      const file = files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        setError('La taille du fichier dépasse la limite de 10MB.');
        return;
      }

      const dataset: DataSet = await processFile(file);
      dataset.categories = selectedCategories;
      
      addDataset(dataset);
      setActiveDataset(dataset.id);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du traitement du fichier :', error);
      if (error instanceof Error) {
        setError(`Erreur lors du traitement du fichier : ${error.message}`);
      } else {
        setError('Erreur inconnue lors du traitement du fichier.');
      }
    }
  }, [addDataset, setActiveDataset, selectedCategories]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFiles]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onClick = () => {
    if (!selectedCategories.length) {
      setError('Veuillez sélectionner au moins une catégorie');
      return;
    }
    fileInputRef.current?.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Catégorisation */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Catégoriser vos données :</h3>
        <div className="flex items-center space-x-6">
          {categories.map(category => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Zone de dépôt */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer bg-white
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
      >
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`h-12 w-12 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
          
          <div className="text-center">
            <p className="text-xl font-medium text-gray-700">
              {isDragging ? 'Déposez le fichier ici' : 'Glissez vos fichiers ici'}
            </p>
            <p className="text-sm text-gray-500">ou cliquez pour parcourir</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FileType className="h-4 w-4" />
            <span>CSV, Excel, PDF, JSON supportés (max 10MB)</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept=".csv,.json,.xlsx,.xls,.pdf"
        onChange={onChange}
      />
    </div>
  );
};