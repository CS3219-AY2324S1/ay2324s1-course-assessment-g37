export type Complexity = 'Easy' | 'Medium' | 'Hard';

export type FindMatchRequest = {
  userId: string
  complexity: Complexity
}

export type CancelMatchRequest = {
  userId: string
  complexity: null
}

export type MatchRequest = FindMatchRequest | CancelMatchRequest

export type MatchResponse = FindMatchRequest & { 
  roomId: string
}

export type OnMatch = (matchedResponse: MatchResponse) => void
