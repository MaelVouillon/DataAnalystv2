import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { predefinedCategories } from '../utils/categories';
import { ColumnCategory } from '../types/categorization';

interface CategoryAssignmentProps {
  categories: ColumnCategory[];
  onCategoryChange: (columnName: string, categoryId: string) => void;
  selectedCategories: string[];
}

export const CategoryAssignment: React.FC<CategoryAssignmentProps> = ({
  categories,
  onCategoryChange,
  selectedCategories,
}) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div 
          key={category.columnName} 
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
        >
          <span className="font-medium text-gray-900">{category.columnName}</span>
          <div className="flex items-center space-x-4">
            {predefinedCategories.map((cat) => {
              const categoryIds = Array.isArray(category.categoryId) 
                ? category.categoryId 
                : [category.categoryId];
              
              return (
                <label key={cat.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(cat.id)}
                    onChange={() => onCategoryChange(category.columnName, cat.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};