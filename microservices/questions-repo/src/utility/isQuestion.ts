import { Question } from "../types";
import { hasKey } from ".";

/**
 * Checks that the given input is a Question
 * @param unknown item of unknown type.
 * @returns True if the item is a Question, false otherwise.
 */
export function isQuestion(unknown: unknown): unknown is Question {
  if (!hasKey(unknown, 'title')
      || typeof unknown['title'] !== 'string') {
    return false;
  } else if (!hasKey(unknown, 'category')
      || typeof unknown['category'] !== 'string') {
    return false;
  } else if (!hasKey(unknown, 'difficulty')
      || typeof unknown['difficulty'] !== 'string'
      || !['Easy', 'Medium', 'Hard'].includes(unknown['difficulty'])) {
    return false;
  } else if (!hasKey(unknown, 'description')
      || typeof unknown['description'] !== 'string') {
    return false;
  }
  return true;
}
