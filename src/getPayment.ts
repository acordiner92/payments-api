import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment } from './lib/payments';
import { buildResponse } from './lib/apigateway';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;

  if (!id) {
    throw Error('TODO: handle this case');
  }

  const payment = await getPayment(id);
  return payment ? buildResponse(200, { ...payment }) : buildResponse(404);
};
