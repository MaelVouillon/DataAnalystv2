import React, { useEffect, useState } from 'react';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { ChartView } from './ChartView';
import { ChartConfig } from '../types';

interface AIInsightsProps {
  category: 'finance' | 'marketing' | 'sales';
}

export const AIInsights: React.FC<AIInsightsProps> = ({ category }) => {
  const { getDataInsights, isAnalyzing, error } = useAnalytics(category);
  const [insights, setInsights] = useState<{ answer: string; chartConfig?: ChartConfig } | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const result = await getDataInsights();
        if (result) {
          setInsights(result);
        }
      } catch (err) {
        console.error('Error loading insights:', err);
      }
    };

    loadInsights();
  }, [getDataInsights]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center space-x-2 p-8">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        <span className="text-gray-600">Analyse en cours...</span>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <Brain className="h-6 w-6 text-indigo-600 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-indigo-900 mb-2">
              Analyse IA
            </h3>
            <p className="text-indigo-700">{insights.answer}</p>
          </div>
        </div>
      </div>

      {insights.chartConfig && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {insights.chartConfig.title}
          </h4>
          <div className="h-[400px]">
            <ChartView config={insights.chartConfig} />
          </div>
        </div>
      )}
    </div>
  );
};