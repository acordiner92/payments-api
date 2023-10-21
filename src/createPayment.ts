import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseJsonSafe } from './lib/apigateway';
import { createPayment } from './lib/payments';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const PaymentRequest = z.object({
  amount: z.number().positive(),
  currency: z.string(),
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return buildResponse(400);
  }

  const parsedJsonResult = parseJsonSafe(event.body);
  if (!parsedJsonResult.success) {
    return buildResponse(400);
  }

  const paymentId = randomUUID();
  const result = PaymentRequest.safeParse(parsedJsonResult.result);

  if (!result.success) {
    return buildResponse(422);
  }

  await createPayment({ ...result.data, id: paymentId });
  return buildResponse(201, { result: paymentId });
};
