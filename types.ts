export interface Dive {
  id: string;
  diveNumber: number;
  date: string;
  location: string;
  site: string;
  buddies?: string;
  duration: number; // in minutes
  maxDepth: number; // in meters
  visibility?: string;
  waterTemp?: number;
  notes: string;
  rating: number; // 1-5
}

export type ViewState = 'dashboard' | 'add' | 'stats';
