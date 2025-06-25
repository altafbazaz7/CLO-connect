export interface ContentItem {
  id: string;
  imagePath: string;
  creator: string;
  title: string;
  pricingOption: number; // 0 = Free, 1 = View Only, 2 = Paid
  price?: number;
}

export interface FilterState {
  searchKeyword: string;
  pricingOptions: {
    paid: boolean;
    free: boolean;
    viewOnly: boolean;
  };
  sortBy: 'name' | 'priceHigh' | 'priceLow';
  priceRange: {
    min: number;
    max: number;
  };
}

export interface AppState {
  contents: ContentItem[];
  filteredContents: ContentItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  filters: FilterState;
}