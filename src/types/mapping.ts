export interface ColumnMapping {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'currency';
  format?: string;
  validated: boolean;
}

export interface DataMapping {
  id: string;
  name: string;
  columns: ColumnMapping[];
  createdAt: number;
  lastUsed: number;
}

export interface ValidationError {
  row: number;
  column: string;
  value: any;
  message: string;
}