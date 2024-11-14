export interface CategoryKeyword {
  keyword: string;
  weight: number;
}

export interface Category {
  id: string;
  name: string;
  keywords: CategoryKeyword[];
  route: string;
}

export interface ColumnCategory {
  columnName: string;
  categoryId: string | string[];
  confidence: number;
}

export interface DatasetCategories {
  id: string;
  categories: ColumnCategory[];
}