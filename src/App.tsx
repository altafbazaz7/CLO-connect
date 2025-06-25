import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchContent } from './store/contentSlice';
import { AppDispatch } from './store/store';
import SearchBar from './components/SearchBar';
import PricingFilters from './components/PricingFilters';
import ContentGrid from './components/ContentGrid';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>CONNECT</h1>
        </div>
      </header>
      
      <div className="container">
        <div className="filters-section">
          <SearchBar />
          <PricingFilters />
        </div>
        
        <ContentGrid />
      </div>
    </div>
  );
};

export default App;