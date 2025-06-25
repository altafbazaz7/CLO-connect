import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setSearchKeyword } from '../store/contentSlice';

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const searchKeyword = useSelector((state: RootState) => state.content.filters.searchKeyword);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchKeyword(e.target.value));
  };

  return (
    <>
      <div className="section-title">Keyword search</div>
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-bar"
          placeholder="Find the items you're looking for"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </div>
    </>
  );
};

export default SearchBar;