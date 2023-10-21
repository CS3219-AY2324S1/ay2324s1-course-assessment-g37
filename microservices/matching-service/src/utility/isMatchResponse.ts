import { MatchResponse } from "../types";
import { hasKey } from "./hasKey";

/**
 * Checks that the given input is a Match Response
 * @param unknown item of unknown type.
 * @returns True if the item is a Match Response, false otherwise.
 */
export function isMatchResponse(unknown: unknown): unknown is MatchResponse {
  if (!hasKey(unknown, 'userId')
      || typeof unknown['userId'] !== 'string') {
    return false;
  } else if (!hasKey(unknown, 'complexity')
      || typeof unknown['complexity'] !== 'string'
      || !['Easy', 'Medium', 'Hard'].includes(unknown['complexity'])) {
    return false;
  } else if (!hasKey(unknown, 'roomId')
      || typeof unknown['roomId'] !== 'string') {
    return false;
  }
  return true;
}
