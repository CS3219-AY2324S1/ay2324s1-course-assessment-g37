import { JsHistoryItem, PgHistoryItem } from "../types";

export function convertFromPgToJs(pgHistoryItem: PgHistoryItem): JsHistoryItem {
  const jsHistoryItem: JsHistoryItem = {
    username: pgHistoryItem.username,
    timestamp: pgHistoryItem.timestamp,
    text: pgHistoryItem.text,
    questionId: pgHistoryItem.question_id,
  };

  return jsHistoryItem;
}
