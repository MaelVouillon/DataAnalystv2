import { useState, useCallback } from 'react';
import { analyzeData } from '../services/openai';
import { ChartConfig } from '../types';
import { useCategorizedData } from './useCategorizedData';

export const useAnalytics = (category: 'finance' | 'marketing' | 'sales') => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latestDataset, allDatasets } = useCategorizedData(category);

  const analyzeQuestion = useCallback(async (
    question: string,
    options: { timeRange?: string; metrics?: string[] } = {}
  ) => {
    if (!latestDataset?.data) {
      throw new Error('No data available for analysis');
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = Array.isArray(latestDataset.data) ? latestDataset.data : [];
      const result = await analyzeData(data, question, {
        category,
        ...options
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [latestDataset, category]);

  const getDataInsights = useCallback(async () => {
    if (!latestDataset?.data) {
      return null;
    }

    const data = Array.isArray(latestDataset.data) ? latestDataset.data : [];
    const insightPrompts = {
      finance: "What are the key financial trends and anomalies in this data?",
      marketing: "What are the most effective marketing channels and campaigns based on this data?",
      sales: "What are the key sales performance indicators and trends in this data?"
    };

    try {
      return await analyzeData(data, insightPrompts[category], { category });
    } catch (err) {
      console.error('Error getting insights:', err);
      return null;
    }
  }, [latestDataset, category]);

  return {
    analyzeQuestion,
    getDataInsights,
    isAnalyzing,
    error,
    hasData: !!latestDataset,
    latestDataset,
    allDatasets
  };
};