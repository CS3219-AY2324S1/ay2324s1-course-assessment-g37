import { Question } from "../types";
import { hasKey, isArrayOfType } from ".";

/**
 * Checks that the given input is a Question
 * @param unknown item of unknown type.
 * @returns True if the item is a Question, false otherwise.
 */
export function isQuestion(unknown: unknown): unknown is Question {
  if (!hasKey(unknown, 'title')
      || typeof unknown['title'] !== 'string') {
    return false;
  } else if (!hasKey(unknown, 'categories')
      || !isArrayOfType(unknown['categories'], obj => typeof obj === 'string')) {
    return false;
  } else if (!hasKey(unknown, 'complexity')
      || typeof unknown['complexity'] !== 'string'
      || !['Easy', 'Medium', 'Hard'].includes(unknown['complexity'])) {
    return false;
  } else if (!hasKey(unknown, 'description')
      || typeof unknown['description'] !== 'string') {
    return false;
  }
  return true;
}
