import amqp from 'amqplib';
import { MatchRequest } from './types';
import { v4 as generateUuid } from 'uuid';
import { isMatchResponse } from './utility/isMatchResponse';

const QUEUE_NAME = 'matching_service_queue';

const HOST = '127.0.0.1';
const PORT = '5672';

export async function findMatch(request: MatchRequest) {
  const connection = await amqp.connect(`amqp://${HOST}:${PORT}`);
  const channel = await connection.createChannel();
  const q = await channel.assertQueue('', { exclusive: true });

  const correlationId = generateUuid();

  const consumerPromise = new Promise<MatchRequest | null>((resolve) => {
    channel.consume(
      q.queue,
      function(msg) {
        if (!msg) {
          console.log('No message found on consume, dropping packet');
          resolve(null);
          return;
        }
        if (msg.properties.correlationId != correlationId) {
          console.log('Request id does not match, dropping packet');
          resolve(null);
          return;
        }
        connection.close();
        const foundMatch = JSON.parse(msg.content.toString());
        if (!isMatchResponse(foundMatch)) {
          resolve(null);
          return;
        }
        resolve(foundMatch);
      },
      {
        noAck: true
      }
    );
  });

  channel.sendToQueue(
    QUEUE_NAME,
    Buffer.from(JSON.stringify(request)),
    {
      correlationId: correlationId,
      replyTo: q.queue
    }
  );

  return consumerPromise;
}
