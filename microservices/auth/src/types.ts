export interface User {
  username: string;
  displayName: string;
  password: string;
  role: "basic" | "admin";
}

export interface UserWithoutPassword {
  username: string;
  displayName: string;
  role: "basic" | "admin";
}

export type Complexity = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  _id: string;
  title: string;
  categories: string[];
  complexity: Complexity;
  description: string;
}

export type FindMatchRequest = {
  userId: string
  complexity: Complexity
}

export type CancelMatchRequest = {
  userId: string
  complexity: null
}

export type MatchRequest = FindMatchRequest | CancelMatchRequest

export type MatchResponse = FindMatchRequest & {
  roomId: string
}

export interface HistoryItem {
  username: string;
  timestamp: string;
  questionId: string;
  text: string;
}
