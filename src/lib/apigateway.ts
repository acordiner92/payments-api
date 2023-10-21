import { APIGatewayProxyResult } from 'aws-lambda';

export const buildResponse = (
  statusCode: number,
  body?: Record<string, unknown>,
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: body ? JSON.stringify(body) : '',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};

export const parseInput = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch (err) {
    console.error(err);
    return {};
  }
};
