import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment } from 'lib/payments';
import { buildResponse } from 'lib/apigateway';
import { logger } from 'lib/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;

  if (!id) {
    logger.error('Id is not present in pathParameters');
    return buildResponse(400);
  }

  const payment = await getPayment(id);

  if (!payment) {
    logger.error({ id }, 'Payment not found');
    return buildResponse(404);
  }

  logger.info({ payment }, 'Returning payment');
  return buildResponse(200, payment);
};
