export interface CheckInPayload {
  mood: string;
  text: string;
  location_opt_in: boolean;
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
