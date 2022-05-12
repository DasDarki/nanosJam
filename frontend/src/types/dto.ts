export interface User {
  id: number;
  username: string;
  avatar: string;
  isAdmin: boolean;
}

export interface GameJamEvent {
  id: number;
  theme?: string;
  scheduledAt: Date;
  goesUntil: Date;
  teamsAllowed: boolean;
}
