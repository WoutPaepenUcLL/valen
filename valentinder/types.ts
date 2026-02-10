export interface Profile {
  name: string;
  age: string;
  bio: string;
  photos: string[];
}

export enum AppMode {
  SWIPE = 'SWIPE',
  MATCH = 'MATCH',
}
