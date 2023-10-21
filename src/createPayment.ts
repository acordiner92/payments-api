import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, safeParseJson } from 'lib/apigateway';
import { createPayment } from 'lib/payments';
import { logger } from 'lib/logger';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const PaymentRequest = z.object({
  amount: z.number().positive(),
  currency: z.string(),
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    logger.error('Request body is not set in request');
    return buildResponse(400);
  }

  const parsedJsonResult = safeParseJson(event.body);
  if (!parsedJsonResult.success) {
    logger.error({ body: event.body }, 'Request body contains invalid json');
    return buildResponse(400);
  }

  const paymentId = randomUUID();
  const result = PaymentRequest.safeParse(parsedJsonResult.result);

  if (!result.success) {
    logger.error({ err: result.error }, 'Parsing of request body has failed');
    return buildResponse(422);
  }

  const payment = { ...result.data, id: paymentId };
  logger.info({ payment }, 'Creating payment');

  await createPayment(payment);
  return buildResponse(201, { id: paymentId });
};
