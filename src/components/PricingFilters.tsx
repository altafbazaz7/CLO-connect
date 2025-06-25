import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setPricingFilter, resetFilters } from '../store/contentSlice';
import PriceSlider from './PriceSlider';
import SortDropdown from './SortDropdown';

const PricingFilters: React.FC = () => {
  const dispatch = useDispatch();
  const pricingOptions = useSelector((state: RootState) => state.content.filters.pricingOptions);

  const handleFilterChange = (type: 'paid' | 'free' | 'viewOnly', checked: boolean) => {
    dispatch(setPricingFilter({ type, value: checked }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <>
      <div className="section-title">Contents Filter</div>
      <div className="filter-controls">
        <div className="pricing-filters">
          <span className="pricing-filters-label">Pricing Option</span>
          
          <div className={`filter-checkbox ${pricingOptions.paid ? 'active' : ''}`}>
            <input
              type="checkbox"
              id="paid"
              checked={pricingOptions.paid}
              onChange={(e) => handleFilterChange('paid', e.target.checked)}
            />
            <label htmlFor="paid">Paid</label>
          </div>
          
          <div className={`filter-checkbox ${pricingOptions.free ? 'active' : ''}`}>
            <input
              type="checkbox"
              id="free"
              checked={pricingOptions.free}
              onChange={(e) => handleFilterChange('free', e.target.checked)}
            />
            <label htmlFor="free">Free</label>
          </div>
          
          <div className={`filter-checkbox ${pricingOptions.viewOnly ? 'active' : ''}`}>
            <input
              type="checkbox"
              id="viewOnly"
              checked={pricingOptions.viewOnly}
              onChange={(e) => handleFilterChange('viewOnly', e.target.checked)}
            />
            <label htmlFor="viewOnly">View Only</label>
          </div>
        </div>
        
        <PriceSlider />
        <SortDropdown />
        
        <button className="reset-button" onClick={handleReset}>
          RESET
        </button>
      </div>
    </>
  );
};

export default PricingFilters;