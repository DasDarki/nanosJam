import {DateTime} from "luxon";

export interface User {
  id: number;
  username: string;
  avatar: string;
  isAdmin: boolean;
}

export interface GameJamEvent {
  id: number;
  theme?: string;
  scheduledAt: DateTime;
  submissionGoesUntil: DateTime;
  goesUntil: DateTime;
  teamsAllowed: boolean;
  resultsShown: boolean;
}
