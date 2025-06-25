import React from 'react';

const SkeletonItem: React.FC = () => {
  return (
    <div className="skeleton-item">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
        <div className="skeleton-bottom">
          <div className="skeleton-line badge"></div>
          <div className="skeleton-line price"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonItem;