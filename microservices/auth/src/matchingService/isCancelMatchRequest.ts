import { CancelMatchRequest } from "../types";
import { hasKey } from "./hasKey";

/**
 * Checks that the given input is a Match Request
 * @param unknown item of unknown type.
 * @returns True if the item is a Match Request, false otherwise.
 */
export function isCancelMatchRequest(unknown: unknown): unknown is CancelMatchRequest {
  if (!hasKey(unknown, 'userId')
      || typeof unknown['userId'] !== 'string') {
    return false;
  } else if (!hasKey(unknown, 'complexity')
      || unknown['complexity'] !== null) {
    return false;
  }
  return true;
}
