## Matching Service

This directory sets up a server to match users based on their sleected question complexity.

### Set Up
Clone the repository, install dependencies and set up environment.
```
cd ./microservices/matching-service
npm install
```

Run the rabbitMQ container to listen to client and server messages via Advanced Message Queue Protocol (AMQP) on local host port 5672.
```
npm run start:rabbitMQ
```

Start the server.
```
npm run dev
```

### Test

Request for a match by opening 2 new terminals to simulate 2 clients.
On the first client, run the matching service with userId `123` and question complexity `Easy`
```
cd ./microservices/matching-service
npm run test:match -- 123 Easy
```

On the second client, run the matching service with userId `456` and question complexity `Easy`
```
cd ./microservices/matching-service
npm run test:match -- 456 Easy
```

Expected response on the first client
```
Match results: {"userId":"456","complexity":"Easy"}
```

Expected response on the second client
```
Match results: {"userId":"123","complexity":"Easy"}
```

### Build and Run
Build the docker image and run
```
cd ./microservices/matching-service
docker build . --file Dockerfile.match -t gohyongjing/matching-service
docker run -p 5672:5672 --network=host gohyongjing/matching-service
```

### API Reference

#### Types

```
type MatchRequest = {
  userId: string
  complexity: 'Easy' | 'Medium' | 'Hard'
}
```

#### Request Match

Request: send AMQP message to the server's queue
```
queue: 'matching_service_queue', # Server's queue name
buffer: Buffer.from(JSON.stringify(request)), # Send a request of type MatchRequest
options: {
  correlationId: correlationId, # Unique transaction id (string) 
  replyTo: clientQueueName # Client's queue name (string)
}
```
