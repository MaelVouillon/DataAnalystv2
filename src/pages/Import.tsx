import React, { useState, useCallback } from 'react';
import { FileText, Upload, Brain, Table, AlertTriangle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { processFile } from '../utils/fileProcessing';
import { useDataStore } from '../hooks/useDataStore';
import { DataPreview } from '../components/DataPreview';

export const Import: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addDataset, setActiveDataset } = useDataStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await processFile(file);
      console.log('Fichier traité:', result);
      
      result.categories = selectedCategories; // Assigner les catégories
      addDataset(result);
      setActiveDataset(result.id);
    } catch (err) {
      console.error('Erreur lors du traitement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement du fichier');
    } finally {
      setLoading(false);
    }
  }, [addDataset, setActiveDataset, selectedCategories]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json']
    },
    multiple: false
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import de Données</h1>
          <p className="text-gray-500">Chargez vos données pour analyse</p>
        </div>

        {/* Zone de dépôt */}
        <div
          {...getRootProps()}
          className={`bg-white rounded-xl shadow-lg p-8 text-center border-2 border-dashed transition-colors cursor-pointer
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Traitement du fichier...
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Veuillez patienter pendant l'analyse
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-indigo-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez votre fichier'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ou cliquez pour sélectionner
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Formats supportés : CSV, Excel, JSON
                </div>
              </>
            )}
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Aperçu des données */}
        <DataPreview />
      </div>
    </div>
  );
};