import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';

export type PaymentsQueryInput = {
  currency?: string;
};

export const buildQuery = ({
  currency,
}: PaymentsQueryInput): Omit<ScanCommandInput, 'TableName'> => ({
  ...(currency && {
    FilterExpression: 'currency = :currency',
    ExpressionAttributeValues: {
      ':currency': currency,
    },
  }),
});
