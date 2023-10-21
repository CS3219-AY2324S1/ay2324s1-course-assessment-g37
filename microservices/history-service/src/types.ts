export interface PgHistoryItem {
  username: string;
  timestamp: Date;
  question_id: string;
  text: string;
}

export interface JsHistoryItem {
  username: string;
  timestamp: Date;
  questionId: string;
  text: string;
}
