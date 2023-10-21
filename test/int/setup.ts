import { CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDB } from '../../src/lib/dynamodb';

beforeEach(async () => {
  await DynamoDB.send(
    new CreateTableCommand({
      TableName: 'Payments',
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
      ],
    }),
  );
});

afterEach(async () => {
  await DynamoDB.send(
    new DeleteTableCommand({
      TableName: 'Payments',
    }),
  );
});
