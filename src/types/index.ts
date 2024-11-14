export interface DataSet {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'pdf' | 'json';
  data: any;
  sheets?: { [key: string]: any[] }; // For Excel data
  uploadedAt: number;
  categories?: string[]; // Added categories field
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: any[]; // Ou affinez le type si possible
  xAxis: string;
  yAxis: string;
}

export interface SavedChart {
  id: string;
  timestamp: number;
  config: ChartConfig;
  datasetId: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface HistoryState {
  charts: SavedChart[];
  messages: ChatMessage[];
}