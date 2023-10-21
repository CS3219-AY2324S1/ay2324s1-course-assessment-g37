#!/usr/bin/env node

import { findMatch } from "../client";
import { isFindMatchRequest } from "./isFindMatchRequest";

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log("Usage: node ./rpc_client.js [userId complexity]");
  process.exit(1);
}

const request = {
  userId: args[0],
  complexity: args[1]
}

if (!isFindMatchRequest(request)) {
  console.log("complexity must be one of ['Easy', 'Medium', 'Hard']");
  process.exit(1);
}

findMatch(request).then(result => console.log(`Match results: ${JSON.stringify(result)}`))
