import { Category, ColumnCategory } from '../types/categorization';
import { predefinedCategories } from './categories';

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
};

const calculateColumnScore = (columnName: string, category: Category): number => {
  const normalizedColumn = normalizeText(columnName);
  let totalScore = 0;
  let maxPossibleScore = 0;

  category.keywords.forEach(({ keyword, weight }) => {
    const normalizedKeyword = normalizeText(keyword);
    maxPossibleScore += weight;

    if (normalizedColumn.includes(normalizedKeyword)) {
      totalScore += weight;
    }
  });

  return totalScore / maxPossibleScore;
};

export const categorizeColumns = (columns: string[]): ColumnCategory[] => {
  const categorization: ColumnCategory[] = [];
  const confidenceThreshold = 0.3;

  columns.forEach(column => {
    let bestMatch: ColumnCategory | null = null;
    let highestConfidence = 0;

    predefinedCategories.forEach(category => {
      const confidence = calculateColumnScore(column, category);
      
      if (confidence > highestConfidence && confidence >= confidenceThreshold) {
        highestConfidence = confidence;
        bestMatch = {
          columnName: column,
          categoryId: category.id,
          confidence
        };
      }
    });

    if (bestMatch) {
      categorization.push(bestMatch);
    } else {
      categorization.push({
        columnName: column,
        categoryId: 'uncategorized',
        confidence: 0
      });
    }
  });

  return categorization;
};