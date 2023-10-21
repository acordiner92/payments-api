import { buildQuery } from 'lib/paymentsQueryBuilder';

describe('Payments Query Builder', () => {
  it('if no currency input is provided no expressions are returned', async () => {
    expect(buildQuery({})).toStrictEqual({});
  });

  it('if the currency input is provided the currency expressions are returned', async () => {
    expect(
      buildQuery({
        currency: 'SGD',
      }),
    ).toStrictEqual({
      FilterExpression: 'currency = :currency',
      ExpressionAttributeValues: {
        ':currency': 'SGD',
      },
    });
  });
});
