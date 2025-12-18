export type Language = 'ja' | 'en';

export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface SlideData {
  id: string;
  imageUrl: string;
  content: string;
  authorPubkey: string;
  createdAt: number;
  eventId: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  READY = 'READY',
  ERROR = 'ERROR',
}

export interface FetchStats {
  eventsFound: number;
  imagesFound: number;
}
