import { DocumentClient } from './dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { buildQuery, PaymentsQueryInput } from './paymentsQueryBuilder';

export const getPayment = async (paymentId: string): Promise<Payment | null> => {
  const result = await DocumentClient.send(
    new GetCommand({
      TableName: 'Payments',
      Key: { id: paymentId },
    }),
  );

  return (result.Item as Payment) ?? null;
};

export const listPayments = async (queryInput: PaymentsQueryInput): Promise<Payment[]> => {
  const result = await DocumentClient.send(
    new ScanCommand({
      TableName: 'Payments',
      ...buildQuery(queryInput),
    }),
  );

  return (result.Items ?? []) as Payment[];
};

export const createPayment = async (payment: Payment): Promise<void> => {
  await DocumentClient.send(
    new PutCommand({
      TableName: 'Payments',
      Item: payment,
    }),
  );
};

export type Payment = {
  id: string;
  amount: number;
  currency: string;
};
