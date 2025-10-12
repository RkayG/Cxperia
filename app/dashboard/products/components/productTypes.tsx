// src/types/productTypes.ts

export interface PerformanceMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  lastUpdated: string;
  icon?: any;
}

export interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  experience: string;
  qrCodeStatus: 'Generated' | 'Pending' | 'Not Set';
  addedDate: string;
  _fullExp?: any; // Full experience data for editing
}

export interface ProductPerformanceOverviewProps {
  metrics: PerformanceMetric[];
}

export interface PerformanceMetricCardProps {
  metric: PerformanceMetric;
}

export interface ProductListingsProps {
  products: Product[];
}

export interface ProductCardProps {
  product: Product;
}

export interface FilterBarProps {
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  onAddNewProduct?: () => void;
}
