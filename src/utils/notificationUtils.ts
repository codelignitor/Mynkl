import { NotificationItem, NotificationSection, FlattenedNotificationData } from '../services/notification_types';

export const categorizeNotifications = (notifications: NotificationItem[]): NotificationSection[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const categorized: { [key: string]: NotificationItem[] } = {
    'Today': [],
    'Yesterday': [],
    'This Week': [],
    'Older': []
  };

  notifications.forEach(notification => {
    const notificationDate = new Date(notification.created_at);
    const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());
    
    const diffTime = today.getTime() - notificationDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      categorized['Today'].push(notification);
    } else if (diffDays === 1) {
      categorized['Yesterday'].push(notification);
    } else if (diffDays <= 7) {
      categorized['This Week'].push(notification);
    } else {
      categorized['Older'].push(notification);
    }
  });

  return Object.entries(categorized)
    .filter(([_, items]) => items.length > 0)
    .map(([category, items], index) => ({
      id: `section-${index + 1}`,
      category,
      items,
      type: 'section' as const,
      data: items 
    }));
};


export const getFlattenedNotificationData = (notifications: NotificationItem[]): FlattenedNotificationData[] => {
  const sections = categorizeNotifications(notifications);
  const flattenedData: FlattenedNotificationData[] = [];
  
  sections.forEach(section => {
    flattenedData.push({
      type: 'header',
      data: section,
      id: `header-${section.id}`
    });
    
    section.items.forEach(item => {
      flattenedData.push({
        type: 'item',
        data: item,
        id: item.id
      });
    });
  });
  
  return flattenedData;
};
