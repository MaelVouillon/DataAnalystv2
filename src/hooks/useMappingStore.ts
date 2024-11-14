import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DataMapping } from '../types/mapping';
import { v4 as uuidv4 } from 'uuid';

interface MappingStore {
  mappings: DataMapping[];
  addMapping: (mapping: Omit<DataMapping, 'id' | 'createdAt' | 'lastUsed'>) => void;
  updateMapping: (id: string, mapping: Partial<DataMapping>) => void;
  findSimilarMapping: (columns: string[]) => DataMapping | null;
  deleteMapping: (id: string) => void;
}

export const useMappingStore = create<MappingStore>()(
  persist(
    (set, get) => ({
      mappings: [],
      addMapping: (mapping) =>
        set((state) => ({
          mappings: [
            ...state.mappings,
            {
              ...mapping,
              id: uuidv4(),
              createdAt: Date.now(),
              lastUsed: Date.now(),
            },
          ],
        })),
      updateMapping: (id, mapping) =>
        set((state) => ({
          mappings: state.mappings.map((m) =>
            m.id === id
              ? { ...m, ...mapping, lastUsed: Date.now() }
              : m
          ),
        })),
      findSimilarMapping: (columns) => {
        const { mappings } = get();
        return (
          mappings.find((mapping) => {
            const mappingColumns = mapping.columns.map((c) => c.name);
            const similarity = columns.filter((c) => mappingColumns.includes(c)).length;
            return similarity / Math.max(columns.length, mappingColumns.length) > 0.7;
          }) || null
        );
      },
      deleteMapping: (id) =>
        set((state) => ({
          mappings: state.mappings.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'mapping-storage',
    }
  )
);