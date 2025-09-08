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
