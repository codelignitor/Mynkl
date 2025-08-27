import { useState, useEffect } from 'react';
import { getNotifications } from '../../services/apis';
import { NotificationItem, NotificationSection, ScreenContent, NotificationResponse } from '../../services/notification_types';
import { categorizeNotifications } from '../../utils/notificationUtils';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationSection[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const fetchNotifications = async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await getNotifications(page, 20);
      
      if (response && Array.isArray(response)) {
        const categorized = categorizeNotifications(response);
        
        if (isLoadMore) {
          setNotifications(prev => {
            const existingItems = prev.flatMap(section => section.items);
            const newItems = response;
            const allItems = [...existingItems, ...newItems];
            return categorizeNotifications(allItems);
          });
        } else {
          setNotifications(categorized);
        }
        
        setCurrentPage(1);
        setHasNextPage(false);
        setTotalItems(response.length);
        
      } else if (response && response.data && Array.isArray(response.data)) {
        const categorized = categorizeNotifications(response.data);
        
        if (isLoadMore) {
          setNotifications(prev => {
            const existingItems = prev.flatMap(section => section.items);
            const newItems = response.data;
            const allItems = [...existingItems, ...newItems];
            return categorizeNotifications(allItems);
          });
        } else {
          setNotifications(categorized);
        }
        
        setCurrentPage(response.pagination.current_page);
        setHasNextPage(response.pagination.has_next);
        setTotalItems(response.pagination.total_items);
        
      } else {    
        setError('Invalid response format from server');
        setNotifications([]);
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch notifications');
      if (!isLoadMore) {
        setNotifications([]);
      }
    } finally {
     
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  
  const loadMoreNotifications = () => {
 
    if (hasNextPage && !loadingMore && totalItems > 0) {
      fetchNotifications(currentPage + 1, true);
    }
  };

  
  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  
  const refreshNotifications = () => {
    setCurrentPage(1);
    setHasNextPage(false);
    setTotalItems(0);
    fetchNotifications(1, false);
  };

  
  const isScreenLoading = loading;

 
  const getScreenContent = (): ScreenContent => {
    if (isScreenLoading) {
      return { type: 'loading' };
    }
    
    if (error) {
      return { 
        type: 'error', 
        error: error 
      };
    }
    
    if (notifications.length > 0) {
      return { 
        type: 'notifications', 
        sections: notifications
      };
    }
    
    return { type: 'empty' };
  };

    
  return {
    loading,
    loadingMore,
    error,
    refreshNotifications,
    loadMoreNotifications,
    isScreenLoading,
    getScreenContent,
    hasNextPage,
    totalItems,
    currentPage,
  };
};
