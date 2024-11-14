import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  data: any[];
  columns: string[];
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  tableName: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  currentPage,
  rowsPerPage,
  onPageChange,
  tableName
}) => {
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startRow = currentPage * rowsPerPage;
  const endRow = Math.min((currentPage + 1) * rowsPerPage, data.length);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-md font-medium text-gray-700">{tableName}</h3>
      </div>

      <div className="overflow-auto max-h-[500px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((column, colIndex) => (
                <th
                  key={`${tableName}-header-${colIndex}-${column}`}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50 sticky top-0"
                  style={{ minWidth: '150px' }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(startRow, endRow).map((row, rowIndex) => (
              <tr key={`${tableName}-row-${startRow + rowIndex}`} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td
                    key={`${tableName}-cell-${startRow + rowIndex}-${colIndex}`}
                    className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                  >
                    {String(row[column] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Lignes {startRow + 1} à {endRow} sur {data.length}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} sur {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};