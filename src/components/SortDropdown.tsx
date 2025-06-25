import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setSortBy } from '../store/contentSlice';

const SortDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const sortBy = useSelector((state: RootState) => state.content.filters.sortBy);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value as 'name' | 'priceHigh' | 'priceLow'));
  };

  

  return (
    <div className="sort-container">
      <div className="sort-label">3. Sorting</div>
      <div className="sort-dropdown-wrapper">
        <label className="sort-by-label">Sort by</label>
        <select 
          className="sort-dropdown" 
          value={sortBy} 
          onChange={handleSortChange}
        >
          <option value="name">Relevance</option>
          <option value="priceHigh">Higher Price</option>
          <option value="priceLow">Lower Price</option>
        </select>
      </div>
    </div>
  );
};

export default SortDropdown;