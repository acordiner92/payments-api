import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment } from './lib/payments';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const PaymentRequest = z.object({
  amount: z.number().positive(),
  currency: z.string(),
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const paymentId = randomUUID();
  // TODO: fix up parseInput
  const result = PaymentRequest.safeParse(parseInput(event.body || '{}'));

  if (!result.success) {
    return buildResponse(422);
  }

  await createPayment({ ...result.data, id: paymentId });
  return buildResponse(201, { result: paymentId });
};
