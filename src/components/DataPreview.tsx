import React, { useState, useEffect } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';
import { DataTable } from './DataTable';
import { processExcelSheets } from '../utils/excelProcessing';
import { ColumnMapping } from './ColumnMapping';
import { CategoryAssignment } from './CategoryAssignment';
import { ColumnMapping as IColumnMapping } from '../types/mapping';
import { useMappingStore } from '../hooks/useMappingStore';
import { useCategorization } from '../hooks/useCategorization';
import { categorizeColumns } from '../utils/categorization';

const ROWS_PER_PAGE = 15;

const categories = [
  { id: 'finance', label: 'Finance' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Ventes' }
];

export const DataPreview: React.FC = () => {
  const { datasets, activeDataset, updateDataset } = useDataStore();
  const { findSimilarMapping, addMapping, updateMapping } = useMappingStore();
  const { addDatasetCategories, updateColumnCategory, getDatasetCategories, updateDatasetCategories } = useCategorization();
  const [currentPages, setCurrentPages] = useState<{ [key: string]: number }>({});
  const [activeSheet, setActiveSheet] = useState(0);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const currentDataset = datasets.find(ds => ds.id === activeDataset);

  useEffect(() => {
    if (currentDataset?.categories) {
      setSelectedCategories(currentDataset.categories);
    }
  }, [currentDataset]);

  useEffect(() => {
    if (currentDataset?.data && activeDataset && !getDatasetCategories(activeDataset)) {
      const sheets = processExcelSheets(currentDataset.data);
      if (sheets.length > 0 && sheets[0].tables.length > 0) {
        const columns = sheets[0].tables[0].columns;
        const columnCategories = categorizeColumns(columns);
        addDatasetCategories({
          id: activeDataset,
          categories: columnCategories
        });
      }
    }
  }, [currentDataset, activeDataset, addDatasetCategories, getDatasetCategories]);

  const handleCategoryChange = (categoryId: string) => {
    // Gérer la sélection/désélection des catégories globales
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
  
    if (currentDataset && activeDataset && sheets) {
      // Mettre à jour les catégories du dataset
      updateDataset(activeDataset, {
        categories: newCategories
      });
  
      // Récupérer toutes les colonnes de tous les onglets et tables
      const allColumns = sheets.reduce((acc, sheet) => {
        sheet.tables.forEach(table => {
          acc.push(...table.columns);
        });
        return acc;
      }, [] as string[]);
  
      // Créer les catégories mises à jour pour chaque colonne
      const updatedColumnCategories = allColumns.map(columnName => ({
        columnName,
        categoryId: newCategories, // Assigner toutes les catégories sélectionnées à chaque colonne
        confidence: 1
      }));
  
      // Mettre à jour les catégories dans le store
      updateDatasetCategories(activeDataset, updatedColumnCategories);
    }
  };

  const handlePageChange = (sheetName: string, tableIndex: number, page: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [`${sheetName}-${tableIndex}`]: page
    }));
  };

  const handleMappingChange = (columnName: string, mapping: Partial<IColumnMapping>) => {
    if (!sheets[activeSheet]?.tables[0]) return;
    
    const currentMapping = findSimilarMapping(sheets[activeSheet].tables[0].columns);
    
    if (currentMapping) {
      updateMapping(currentMapping.id, {
        columns: currentMapping.columns.map(col => 
          col.name === columnName ? { ...col, ...mapping } : col
        )
      });
    } else {
      addMapping({
        name: `${sheets[activeSheet].name} - Mapping`,
        columns: sheets[activeSheet].tables[0].columns.map(col => ({
          name: col,
          type: col === columnName ? (mapping.type || 'text') : 'text',
          format: col === columnName ? mapping.format : undefined,
          validated: col === columnName ? (mapping.validated || false) : false
        }))
      });
    }
  };

  const handleColumnCategoryChange = (columnName: string, categoryId: string) => {
    if (!activeDataset || !datasetCategories) return;

    const currentCategory = datasetCategories.categories.find(
      c => c.columnName === columnName
    );

    // Add null check
    if (!currentCategory) {
      return;
    }

    let newCategoryId: string;
    if (currentCategory.categoryId === categoryId) {
      // Décocher la catégorie
      newCategoryId = 'uncategorized';
    } else if (currentCategory.categoryId === 'multiple') {
      // Gérer les sélections multiples
      const currentCategories = new Set(selectedCategories);
      if (currentCategories.has(categoryId)) {
        currentCategories.delete(categoryId);
      } else {
        currentCategories.add(categoryId);
      }
      newCategoryId = currentCategories.size > 1 ? 'multiple' : (currentCategories.size === 1 ? Array.from(currentCategories)[0] : 'uncategorized');
    } else {
      // Nouveau cochage
      newCategoryId = categoryId;
    }

    updateColumnCategory(activeDataset, columnName, newCategoryId);
  };

  if (!currentDataset?.data) return null;

  const sheets = processExcelSheets(currentDataset.data);
  if (sheets.length === 0) return null;

  const datasetCategories = activeDataset ? getDatasetCategories(activeDataset) : null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Table className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Aperçu des Données</h2>
        </div>
        <button
          onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
        >
          <span>Configuration avancée</span>
          {showAdvancedConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Catégorisation globale */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Catégories du document :</h3>
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

      {/* Onglets des feuilles */}
      {sheets.length > 1 && (
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 tab-scroll-container">
            {sheets.map((sheet, index) => (
              <button
                key={`sheet-${index}`}
                onClick={() => setActiveSheet(index)}
                className={`
                  px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap
                  ${activeSheet === index 
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Configuration avancée */}
      {showAdvancedConfig && sheets[activeSheet]?.tables[0] && (
        <div className="space-y-8 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Configuration avancée des colonnes</h3>
          {datasetCategories && (
            <CategoryAssignment
              categories={datasetCategories.categories}
              onCategoryChange={handleColumnCategoryChange}
              selectedCategories={selectedCategories}
            />
          )}
          <ColumnMapping
            columns={sheets[activeSheet].tables[0].columns}
            mappings={findSimilarMapping(sheets[activeSheet].tables[0].columns)?.columns || []}
            onMappingChange={handleMappingChange}
          />
        </div>
      )}

      {/* Contenu de la feuille active */}
      <div className="space-y-8">
        {sheets[activeSheet]?.tables.map((table, tableIndex) => (
          <DataTable
            key={`${sheets[activeSheet].name}-table-${tableIndex}`}
            data={table.data}
            columns={table.columns}
            currentPage={currentPages[`${sheets[activeSheet].name}-${tableIndex}`] || 0}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={(page) => handlePageChange(sheets[activeSheet].name, tableIndex, page)}
            tableName={sheets.length > 1 ? `${sheets[activeSheet].name} - Tableau ${tableIndex + 1}` : `Tableau ${tableIndex + 1}`}
          />
        ))}

        {(!sheets[activeSheet]?.tables.length) && (
          <div className="text-center py-8 text-gray-500">
            Aucune donnée trouvée dans cette feuille
          </div>
        )}
      </div>
    </div>
  );
};

// Mettre à jour le type ColumnCategory pour supporter les catégories multiples
interface ColumnCategory {
  columnName: string;
  categoryId: string | string[];
  confidence: number;
}