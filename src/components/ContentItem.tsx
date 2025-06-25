import React from 'react';
import { ContentItem as ContentItemType } from '../types';

interface ContentItemProps {
  item: ContentItemType;
}

const ContentItem: React.FC<ContentItemProps> = ({ item }) => {
  const getPricingOptionString = (pricingOption: number): string => {
    switch (pricingOption) {
      case 0: return 'Free';
      case 1: return 'View Only';
      case 2: return 'Paid';
      default: return 'Free';
    }
  };

  const getPricingBadgeClass = (pricingOption: number) => {
    switch (pricingOption) {
      case 0: return 'pricing-badge free';
      case 1: return 'pricing-badge view-only';
      case 2: return 'pricing-badge paid';
      default: return 'pricing-badge';
    }
  };

  const pricingString = getPricingOptionString(item.pricingOption);

  return (
    <div className="content-item">
      <div className="content-image-container">
        <img
          src={item.imagePath}
          alt={item.title}
          className="content-image"
          loading="lazy"
        />
      </div>
      <div className="content-info">
        <div className="content-details">
          <h3 className="content-title">{item.title}</h3>
          <p className="content-creator">{item.creator}</p>
        </div>
        <div className="content-bottom">
          <span className={getPricingBadgeClass(item.pricingOption)}>
            {pricingString}
          </span>
          {item.pricingOption === 2 && item.price && (
            <span className="content-price">${item.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentItem;