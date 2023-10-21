import { hasKey } from "../../../utility/hasKey";
import { MatchRequest } from "../../types";

/**
 * Checks that the given input is a Match Request
 * @param unknown item of unknown type.
 * @returns True if the item is a Match Request, false otherwise.
 */
export function isMatchRequest(unknown: unknown): unknown is MatchRequest {
  if (!hasKey(unknown, 'userId')
      || typeof unknown['userId'] !== 'string') {
    return false;
  } else if (!hasKey(unknown, 'complexity')
      || typeof unknown['complexity'] !== 'string'
      || !['Easy', 'Medium', 'Hard'].includes(unknown['complexity'])) {
    return false;
  }
  return true;
}
