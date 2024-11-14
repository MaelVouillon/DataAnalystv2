import { DataSet } from '../types';

// Common column name patterns for each category
const columnPatterns = {
  finance: {
    revenue: ['revenue', 'revenu', 'ca', 'chiffre_affaires', 'chiffre affaires', 'ventes'],
    expenses: ['expenses', 'depenses', 'dépenses', 'costs', 'coûts', 'charges'],
    cashflow: ['cashflow', 'cash_flow', 'tresorerie', 'trésorerie', 'cash'],
    date: ['date', 'period', 'periode', 'période', 'mois', 'month', 'year', 'année']
  },
  // Autres catégories...
};

// Fonction pour trouver le nom de colonne correspondant
function findMatchingColumn(columns: string[], patterns: string[]): string | null {
  for (const pattern of patterns) {
    const match = columns.find(col => col.toLowerCase() === pattern.toLowerCase());
    if (match) return match;
  }
  return null;
}

// Extract numeric value from data
function extractNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove currency symbols and spaces, replace commas with dots
    const cleaned = value.replace(/[€$\s]/g, '').replace(',', '.');
    return parseFloat(cleaned);
  }
  return 0;
}

// dataMapping.ts
export function mapDataForCategory(dataset: DataSet | undefined, category: string) {
  if (!dataset || !Array.isArray(dataset.data)) {
    return null;
  }

  const data = dataset.data;
  const patterns = columnPatterns[category];
  
  if (!patterns) {
    console.error(`Aucun motif de colonnes défini pour la catégorie: ${category}`);
    return null;
  }

  const columns = Object.keys(data[0]);

  const dateCol = findMatchingColumn(columns, patterns.date);
  const cashFlowCol = findMatchingColumn(columns, patterns.cashflow);
  const revenueCol = findMatchingColumn(columns, patterns.revenue);
  const expensesCol = findMatchingColumn(columns, patterns.expenses);

  if (!dateCol || !cashFlowCol || !revenueCol || !expensesCol) {
    console.error('Colonnes nécessaires manquantes pour le mappage finance.');
    return null;
  }

  return {
    cashFlowData: data.map(row => ({
      month: row[dateCol],
      value: parseFloat(row[cashFlowCol] || '0')
    })).filter(item => !isNaN(item.value)),
    
    revenueData: data.map(row => ({
      month: row[dateCol],
      income: parseFloat(row[revenueCol] || '0'),
      expenses: parseFloat(row[expensesCol] || '0')
    })).filter(item => !isNaN(item.income) && !isNaN(item.expenses))
  };
}