import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from 'lib/apigateway';
import { logger } from 'lib/logger';
import { listPayments } from 'lib/payments';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info({ parameters: event.queryStringParameters }, 'Querying payments');

  const payments = await listPayments({ currency: event.queryStringParameters?.currency });
  return buildResponse(200, payments);
};
