import { MatchRequest } from "../types";
import { isCancelMatchRequest } from "./isCancelMatchRequest";
import { isFindMatchRequest } from "./isFindMatchRequest";

/**
 * Checks that the given input is a Match Request
 * @param unknown item of unknown type.
 * @returns True if the item is a Match Request, false otherwise.
 */
export function isMatchRequest(unknown: unknown): unknown is MatchRequest {
  return isFindMatchRequest(unknown) || isCancelMatchRequest(unknown);
}
