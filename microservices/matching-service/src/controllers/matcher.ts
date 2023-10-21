import { v4 as generateUuid } from 'uuid';
import { Complexity, MatchRequest, OnMatch } from "../types";

function logQueueState(requests: unknown[]) {
  console.log(`Queue: ${JSON.stringify(requests)}`);
}

export function createMatcher() {

  let waitingRequests: {
    request: {
      userId: string,
      complexity: Complexity
    },
    onMatch: OnMatch
  }[] = [];

  /**
   * Queues a match request for a user.
   * Calls the onMatch method with the another match request if both requests have the same complexity.
   * Replaces the original waiting request and onMatch method if called twice with the same userId and complexity.
   *
   * @param request Request to queue.
   * @param onMatch Method to call when a match is found.
   */
  function queueRequest(
    request: MatchRequest, 
    onMatch: OnMatch
  ) {
    waitingRequests = waitingRequests.filter(waiting => waiting.request.userId !== request.userId);
    if (request.complexity === null) {
      logQueueState(waitingRequests);
      return;
    }
    const matchIndex = waitingRequests.findIndex(waiting => {
      return waiting.request.complexity === request.complexity
    });
    if (matchIndex === -1) {
      waitingRequests.push({request, onMatch});
    } else {
      const match = waitingRequests[matchIndex];
      waitingRequests.splice(matchIndex, 1);
      const roomId = generateUuid();
      onMatch({
        ...match.request,
        roomId
      });
      match.onMatch({
        ...request,
        roomId
      });
    }
    logQueueState(waitingRequests);
  }

  return { queueRequest };
}
