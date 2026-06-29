export type SupportType = 'hug' | 'encouragement' | 'calm' | 'cheerUp';

export type SupportOption = {
  id: SupportType;
  title: string;
  subtitle: string;
};

export const SUPPORT_OPTIONS: SupportOption[] = [
  { id: 'hug', title: 'Hug', subtitle: 'Comfort' },
  { id: 'encouragement', title: 'Encouragement', subtitle: 'Hope' },
  { id: 'calm', title: 'Calm', subtitle: 'Gentle support' },
  { id: 'cheerUp', title: 'Cheer Up', subtitle: 'Positive energy' },
];
