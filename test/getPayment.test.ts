import * as payments from 'lib/payments';
import { randomUUID } from 'crypto';
import { handler } from 'src/getPayment';
import createEvent from 'mock-aws-events';

describe('When the user requests the records for a specific payment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Returns the payment matching their input parameter.', async () => {
    const paymentId = randomUUID();
    const mockPayment = {
      id: paymentId,
      currency: 'AUD',
      amount: 2000,
    };
    const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(mockPayment);

    const event = createEvent('aws:apiGateway', {
      pathParameters: {
        id: paymentId,
      },
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockPayment);

    expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
  });

  it('Returns 404 if payment id is not found', async () => {
    const paymentId = randomUUID();
    // no match
    jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

    const event = createEvent('aws:apiGateway', {
      pathParameters: {
        id: paymentId,
      },
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual('');
  });
});
