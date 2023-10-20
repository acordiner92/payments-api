import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "./lib/apigateway";
import { createPayment, Payment } from "./lib/payments";
import { randomUUID } from "crypto";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { id: _id, ...otherValues } = parseInput(event.body || "{}") as Payment;
  const paymentId = randomUUID();

  await createPayment({ ...otherValues, id: paymentId });
  return buildResponse(201, { result: paymentId });
};
