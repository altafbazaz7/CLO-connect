import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setPriceRange } from '../store/contentSlice';

const PriceSlider: React.FC = () => {
  const dispatch = useDispatch();
  const { priceRange, pricingOptions } = useSelector((state: RootState) => state.content.filters);
  const isPaidSelected = pricingOptions.paid;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value), priceRange.max);
    dispatch(setPriceRange({ min: newMin, max: priceRange.max }));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(parseInt(e.target.value), priceRange.min);
    dispatch(setPriceRange({ min: priceRange.min, max: newMax }));
  };

  return (
    <div className={`price-slider-container ${!isPaidSelected ? 'disabled' : ''}`}>
      <div className="price-slider-label">4. Pricing slider</div>
      <div className="price-slider-wrapper">
        <div className="price-inputs">
          <span className="price-value">${priceRange.min}</span>
          <span className="price-separator">-</span>
          <span className="price-value">${priceRange.max}</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="999"
            value={priceRange.min}
            onChange={handleMinChange}
            className="slider slider-min"
            disabled={!isPaidSelected}
          />
          <input
            type="range"
            min="0"
            max="999"
            value={priceRange.max}
            onChange={handleMaxChange}
            className="slider slider-max"
            disabled={!isPaidSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;