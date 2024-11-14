import { useMemo } from 'react';
import { useDataStore } from './useDataStore';
import { DataSet } from '../types';

export const useCategorizedData = (category: 'finance' | 'marketing' | 'sales') => {
  const { datasets } = useDataStore();

  const categorizedData = useMemo(() => {
    return datasets.filter(dataset => 
      dataset.categories?.includes(category)
    );
  }, [datasets, category]);

  const getLatestDataset = (): DataSet | undefined => {
    return categorizedData.reduce((latest, current) => {
      if (!latest) return current;
      return current.uploadedAt > latest.uploadedAt ? current : latest;
    }, undefined as DataSet | undefined);
  };

  const getAllDatasets = (): DataSet[] => {
    return categorizedData;
  };

  return {
    latestDataset: getLatestDataset(),
    allDatasets: getAllDatasets(),
    hasData: categorizedData.length > 0
  };
};