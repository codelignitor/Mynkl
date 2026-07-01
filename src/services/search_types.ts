export interface SearchResult {
    item: {
      type: 'event' | 'place';
      id?: number;
      place_id?: string;
      name?: string;
      main_text?: string;
      secondary_text?: string;
      description?: string;
      location_lat?: number;
      location_lng?: number;
      location_name?: string;
      event_datetime?: string;
      source?: string;
    };
  }