import React, { useRef } from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line,
  PieChart, Pie,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import { Download, Copy, FileText } from 'lucide-react';
import { ChartConfig } from '../types';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];

interface ChartViewProps {
  config: ChartConfig;
}

export const ChartView: React.FC<ChartViewProps> = ({ config }) => {
  const { type, data, title, xAxis, yAxis } = config;
  const chartRef = useRef<HTMLDivElement>(null);

  // Vérifier que les données sont valides
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Données insuffisantes pour afficher le graphique
      </div>
    );
  }

  // Vérifier que toutes les valeurs sont numériques
  const validData = data.filter(item => 
    item && 
    typeof item.name !== 'undefined' && 
    !isNaN(Number(item.value))
  );

  if (validData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Les données ne sont pas dans un format valide pour la visualisation
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={validData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={validData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={validData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {validData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow" ref={chartRef}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {renderChart()}
      <div className="mt-4 flex justify-end space-x-4">
        <button
          onClick={async () => {
            if (!chartRef.current) return;
            const canvas = await html2canvas(chartRef.current);
            const pdf = new jsPDF();
            pdf.addImage(
              canvas.toDataURL('image/png'),
              'PNG',
              10,
              10,
              190,
              0
            );
            pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
          }}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FileText className="h-4 w-4" />
          <span>Exporter PDF</span>
        </button>
      </div>
    </div>
  );
};