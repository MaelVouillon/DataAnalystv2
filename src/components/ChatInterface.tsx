import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { analyzeData } from '../services/openai';
import { useCategorizedData } from '../hooks/useCategorizedData';
import { ChartView } from './ChartView';
import { Loader } from './Loader';
import { ChartConfig } from '../types';

interface ChatInterfaceProps {
  category: 'finance' | 'marketing' | 'sales';
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ category, onClose }) => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { latestDataset } = useCategorizedData(category);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || isLoading) return;

    const message = userMessage.trim();
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setUserMessage('');
    setIsLoading(true);
    setError(null);

    try {
      if (!latestDataset?.data) {
        throw new Error('Aucune donnée disponible pour l\'analyse');
      }

      const data = Array.isArray(latestDataset.data) 
        ? latestDataset.data 
        : [latestDataset.data];

      const analysis = await analyzeData(data, message, { category });
      
      setMessages(prev => [...prev, { text: analysis.answer, isUser: false }]);
      
      if (analysis.chartConfig) {
        setChartConfig(analysis.chartConfig);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      setMessages(prev => [...prev, { 
        text: 'Désolé, je ne peux pas analyser ces données pour le moment.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Assistant IA</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.isUser 
                ? 'bg-blue-100 text-blue-900 ml-auto' 
                : 'bg-gray-100 text-gray-900'
            } max-w-[80%]`}
          >
            {msg.text}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Analyse en cours...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-900 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Chart */}
      {chartConfig && (
        <div className="p-4 border-t border-gray-200">
          <ChartView config={chartConfig} />
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Posez une question sur vos données..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`ml-2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};