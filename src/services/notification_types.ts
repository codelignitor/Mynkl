export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface NotificationSection {
  id: string;
  category: string;
  items: NotificationItem[];
  type: 'section';
  data: NotificationItem[];
}

export interface FlattenedNotificationData {
  type: 'header' | 'item';
  data: NotificationItem | NotificationSection;
  id: string;
}

export interface NotificationResponse {
  data: NotificationItem[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ScreenContent {
  type: 'loading' | 'error' | 'notifications' | 'empty';
  error?: string;
  sections?: NotificationSection[];
}
