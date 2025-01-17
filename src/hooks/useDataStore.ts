import { create } from 'zustand';
import { DataSet } from '../types';

interface DataStore {
  datasets: DataSet[];
  activeDataset: string | null;
  addDataset: (dataset: DataSet) => void;
  updateDataset: (id: string, updates: Partial<DataSet>) => void;
  setActiveDataset: (id: string) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  datasets: [],
  activeDataset: null,
  addDataset: (dataset) =>
    set((state) => ({
      datasets: [...state.datasets, dataset],
    })),
  updateDataset: (id, updates) =>
    set((state) => ({
      datasets: state.datasets.map((ds) =>
        ds.id === id ? { ...ds, ...updates } : ds
      ),
    })),
  setActiveDataset: (id) =>
    set(() => ({
      activeDataset: id,
    })),
}));