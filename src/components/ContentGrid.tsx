import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { loadMoreItems, selectVisibleItems } from '../store/contentSlice';
import ContentItem from './ContentItem';
import SkeletonItem from './SkeletonItem';

const ContentGrid: React.FC = () => {
  const dispatch = useDispatch();
  const visibleItems = useSelector(selectVisibleItems);
  const { filteredContents, loading, hasMore, error } = useSelector((state: RootState) => state.content);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 1000) {
      dispatch(loadMoreItems());
    }
  }, [loading, hasMore, dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (error) {
    return (
      <div className="no-results">
        <h3>Error loading content</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading && visibleItems.length === 0) {
    return (
      <div className="content-grid">
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonItem key={index} />
        ))}
      </div>
    );
  }

  if (filteredContents.length === 0 && !loading) {
    return (
      <div className="no-results">
        <h3>No content found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <>
      <div className="section-title">Contents List</div>
      <div className="content-grid">
        {visibleItems.map((item) => (
          <ContentItem key={item.id} item={item} />
        ))}
      </div>
      
      {loading && hasMore && (
        <div className="content-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonItem key={`skeleton-${index}`} />
          ))}
        </div>
      )}
      
      {!hasMore && visibleItems.length > 0 && (
        <div className="loading">
          All content loaded
        </div>
      )}
    </>
  );
};

export default ContentGrid;