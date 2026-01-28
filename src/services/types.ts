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

export interface WellnessSuggestion {
  id: string;
  suggestion_type: string;
  content_id: string;
  content_type: string;
  title: string;
  duration: number; // Duration in seconds
  description: string;
  file_url: string;
  thumbnail_url: string | null;
}


export type SuggestionAction =
  | {
      action: "ROUTE";
      route: string;
      params?: Record<string, any>;
    }
  | {
      action: "MAP";
      lat: number;
      lng: number;
      place_id: string;
    }
  | {
      action: "SPOTIFY";
      url: string;
    }
  | {
      action: "OPEN_SETTINGS";
      feature: string;
    }
  | {
      action: "SHOW_ACTIVITIES";
      activities: string[];
      prompt?: string;
    }
  | {
      action: "SHOW_MESSAGE";
      message: string;
    }
  | {
      action: "NONE";
    };

// Add to your existing types.ts file

export interface CelebrationResponse {
  celebrated: boolean;
  ai_message: string;
  badges: Array<{
    key: string;
    title: string;
    emoji: string;
  }>;
}

export interface SuggestedActivity {
  id: string;
  title: string;
}

export interface SuggestionData {
  suggested_activity?: SuggestedActivity;
  suggestionType?: string;
}



export interface DailyHugGoalResponse {
  data: {
    daily_goal: number;
    hugs_sent_today: number;
    is_completed: boolean;
  };
}

export interface BadgeStatus {
  badge_code: string;
  name: string;
  earned: boolean;
}


export interface UserWithAiTag {
  user_id: string;
  ai_moment_tag: string;
}

export interface UsersByAiTagResponse {
  data: UserWithAiTag[];
}

// Add to your existing types.ts file

export interface CrisisStatusResponse {
  data: {
    is_crisis: boolean;
  };
}