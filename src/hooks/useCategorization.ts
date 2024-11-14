import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DatasetCategories, ColumnCategory } from '../types/categorization';

interface CategorizationStore {
  datasetCategories: DatasetCategories[];
  addDatasetCategories: (categories: DatasetCategories) => void;
  updateColumnCategory: (datasetId: string, columnName: string, categoryId: string) => void;
  updateDatasetCategories: (datasetId: string, categories: ColumnCategory[]) => void;
  getDatasetCategories: (datasetId: string) => DatasetCategories | null;
}

export const useCategorization = create<CategorizationStore>()(
  persist(
    (set, get) => ({
      datasetCategories: [],
      
      addDatasetCategories: (categories) =>
        set((state) => ({
          datasetCategories: [...state.datasetCategories, categories]
        })),
      
      updateColumnCategory: (datasetId, columnName, categoryId) =>
        set((state) => ({
          datasetCategories: state.datasetCategories.map((dc) =>
            dc.id === datasetId
              ? {
                  ...dc,
                  categories: dc.categories.map((c) =>
                    c.columnName === columnName
                      ? { ...c, categoryId, confidence: 1 }
                      : c
                  )
                }
              : dc
          )
        })),

      updateDatasetCategories: (datasetId, categories) =>
        set((state) => ({
          datasetCategories: state.datasetCategories.map((dc) =>
            dc.id === datasetId
              ? { ...dc, categories }
              : dc
          )
        })),
      
      getDatasetCategories: (datasetId) => {
        const { datasetCategories } = get();
        return datasetCategories.find((dc) => dc.id === datasetId) || null;
      }
    }),
    {
      name: 'categorization-storage'
    }
  )
);