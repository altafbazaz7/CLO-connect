import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, AppState, FilterState } from '../types';

const ITEMS_PER_PAGE = 20;

// Parse URL parameters for initial state
const getInitialFiltersFromURL = (): FilterState => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    searchKeyword: urlParams.get('search') || '',
    pricingOptions: {
      paid: urlParams.get('paid') === 'true',
      free: urlParams.get('free') === 'true',
      viewOnly: urlParams.get('viewOnly') === 'true',
    },
    sortBy: (urlParams.get('sortBy') as 'name' | 'priceHigh' | 'priceLow') || 'name',
    priceRange: {
      min: parseInt(urlParams.get('priceMin') || '0'),
      max: parseInt(urlParams.get('priceMax') || '999'),
    },
  };
};

// Update URL with current filters
const updateURL = (filters: FilterState) => {
  const params = new URLSearchParams();
  
  if (filters.searchKeyword) {
    params.set('search', filters.searchKeyword);
  }
  
  if (filters.pricingOptions.paid) {
    params.set('paid', 'true');
  }
  
  if (filters.pricingOptions.free) {
    params.set('free', 'true');
  }
  
  if (filters.pricingOptions.viewOnly) {
    params.set('viewOnly', 'true');
  }
  
  if (filters.sortBy !== 'name') {
    params.set('sortBy', filters.sortBy);
  }
  
  if (filters.priceRange.min !== 0) {
    params.set('priceMin', filters.priceRange.min.toString());
  }
  
  if (filters.priceRange.max !== 999) {
    params.set('priceMax', filters.priceRange.max.toString());
  }
  
  const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState(null, '', newURL);
};

// Async thunk for fetching content
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async () => {
    const response = await fetch('https://closet-recruiting-api.azurewebsites.net/api/data');
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }
    const data = await response.json();
    return data as ContentItem[];
  }
);

const initialState: AppState = {
  contents: [],
  filteredContents: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  filters: getInitialFiltersFromURL(),
};

// Helper function to convert pricing option number to string
const getPricingOptionString = (pricingOption: number): string => {
  switch (pricingOption) {
    case 0: return 'Free';
    case 1: return 'View Only';
    case 2: return 'Paid';
    default: return 'Free';
  }
};

// Filter and sort content based on current filters
const applyFilters = (contents: ContentItem[], filters: FilterState): ContentItem[] => {
  let filtered = contents;

  // Apply keyword search
  if (filters.searchKeyword.trim()) {
    const keyword = filters.searchKeyword.toLowerCase().trim();
    filtered = filtered.filter(item =>
      item.creator.toLowerCase().includes(keyword) ||
      item.title.toLowerCase().includes(keyword)
    );
  }

  // Apply pricing filters
  const { paid, free, viewOnly } = filters.pricingOptions;
  const hasAnyPricingFilter = paid || free || viewOnly;
  
  if (hasAnyPricingFilter) {
    filtered = filtered.filter(item => {
      if (paid && item.pricingOption === 2) return true;
      if (free && item.pricingOption === 0) return true;
      if (viewOnly && item.pricingOption === 1) return true;
      return false;
    });
  }

  // Apply price range filter (only for paid items)
  if (paid && (filters.priceRange.min > 0 || filters.priceRange.max < 999)) {
    filtered = filtered.filter(item => {
      if (item.pricingOption === 2 && item.price) {
        return item.price >= filters.priceRange.min && item.price <= filters.priceRange.max;
      }
      return item.pricingOption !== 2; // Keep non-paid items
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'priceHigh':
        const priceA = a.pricingOption === 2 ? (a.price || 0) : 0;
        const priceB = b.pricingOption === 2 ? (b.price || 0) : 0;
        return priceB - priceA;
      case 'priceLow':
        const priceA2 = a.pricingOption === 2 ? (a.price || 0) : 0;
        const priceB2 = b.pricingOption === 2 ? (b.price || 0) : 0;
        return priceA2 - priceB2;
      default:
        return 0;
    }
  });

  return filtered;
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.filters.searchKeyword = action.payload;
      state.filteredContents = applyFilters(state.contents, state.filters);
      state.page = 1;
      state.hasMore = true;
      updateURL(state.filters);
    },
    
    setPricingFilter: (state, action: PayloadAction<{ type: 'paid' | 'free' | 'viewOnly'; value: boolean }>) => {
      const { type, value } = action.payload;
      state.filters.pricingOptions[type] = value;
      state.filteredContents = applyFilters(state.contents, state.filters);
      state.page = 1;
      state.hasMore = true;
      updateURL(state.filters);
    },
    
    setSortBy: (state, action: PayloadAction<'name' | 'priceHigh' | 'priceLow'>) => {
      state.filters.sortBy = action.payload;
      state.filteredContents = applyFilters(state.contents, state.filters);
      state.page = 1;
      state.hasMore = true;
      updateURL(state.filters);
    },
    
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filters.priceRange = action.payload;
      state.filteredContents = applyFilters(state.contents, state.filters);
      state.page = 1;
      state.hasMore = true;
      updateURL(state.filters);
    },
    
    resetFilters: (state) => {
      state.filters = {
        searchKeyword: '',
        pricingOptions: {
          paid: false,
          free: false,
          viewOnly: false,
        },
        sortBy: 'name',
        priceRange: {
          min: 0,
          max: 999,
        },
      };
      state.filteredContents = state.contents;
      state.page = 1;
      state.hasMore = true;
      updateURL(state.filters);
    },
    
    loadMoreItems: (state) => {
      state.page += 1;
      const totalPages = Math.ceil(state.filteredContents.length / ITEMS_PER_PAGE);
      if (state.page >= totalPages) {
        state.hasMore = false;
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.payload;
        state.filteredContents = applyFilters(action.payload, state.filters);
        state.hasMore = state.filteredContents.length > ITEMS_PER_PAGE;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });
  },
});

export const { setSearchKeyword, setPricingFilter, setSortBy, setPriceRange, resetFilters, loadMoreItems } = contentSlice.actions;

// Selectors
export const selectVisibleItems = (state: { content: AppState }) => {
  const itemsToShow = state.content.page * ITEMS_PER_PAGE;
  return state.content.filteredContents.slice(0, itemsToShow);
};

// Export helper function for components
export { getPricingOptionString };

export default contentSlice.reducer;