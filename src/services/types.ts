export interface CheckInPayload {
  mood: string;
  lat?: number | null;
  lng?: number | null;
  location_opt_in?: boolean | null;
  anonymous_checkin?: boolean | null;
  message_text?: string | null;
  audio?: string | null;
  checkin_type?: string | null;
  place_name?: string | null;
  checkin_ref?: string | null;
}

export interface OpenToTalkPayload {
  open_to_talk: boolean;
}

export type MapSearchParams = {
  query?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
};


//mood-related types 
export interface MoodCheckin {
  id: number;
  mood: string;
  text: string;
  timestamp: string;
  location_opt_in: boolean;
  checkin_type: string;
  checkin_ref: string;
  details: MoodCheckinDetails;
}

export interface MoodCheckinDetails {
  type: string;
  place_name?: string;
  lat?: number;
  lng?: number;
}

export interface MoodDayData {
  dominant_mood: string | null;
  checkins: string[];
}

export interface MoodCalendarResponse {
  calendar: {
    [date: string]: MoodDayData;
  };
}

export interface MoodDayDetailResponse {
  date: string;
  latest_checkin: MoodCheckin | null;
}