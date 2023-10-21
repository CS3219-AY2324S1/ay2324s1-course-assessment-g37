export type QuestionComplexity = "Easy" | "Medium" | "Hard";

export interface Question {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  complexity: QuestionComplexity;
}

export interface User {
  username: string;
  displayName: string;
  role: "basic" | "admin";
}

export interface NewQuestion {
  title: string;
  description: string;
  categories: string[];
  complexity: QuestionComplexity;
}

export type FindMatchRequest = {
  userId: string
  complexity: QuestionComplexity
}

export type CancelMatchRequest = {
  userId: string
  complexity: null
}

export type MatchRequest = FindMatchRequest | CancelMatchRequest

export type MatchResponse = FindMatchRequest & {
  roomId:  string
}

export type SocketEventHandlers = {
    [event: string]: () => void
}

// I must define this RootState here, somehow HistoryPage state is
// able to crrectly recognise the state, while mine in MainQuestionBank asks for explicit type
interface SuccessSnackbarState {
  isOpen: boolean;
  currentMessage: string;
  messageQueue: string[];
}

export interface RootState {
  successSnackbar: SuccessSnackbarState;
  questions: Question[];
  history: HistoryItem[];
}

export interface HistoryItem {
  username: string;
  timestamp: string;
  questionId: string;
  text: string;
}