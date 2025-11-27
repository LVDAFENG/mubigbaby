export interface Memory {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
}

export interface UserSettings {
  startDate: string; // ISO string
  partnerName: string;
}

export type PolishStatus = 'idle' | 'loading' | 'success' | 'error';
