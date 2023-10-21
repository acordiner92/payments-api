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

type Result = { success: true; result: unknown } | { success: false; error: unknown };

export const parseJsonSafe = (body: string): Result => {
  try {
    return {
      success: true,
      result: JSON.parse(body),
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};
