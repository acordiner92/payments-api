import * as crypto from 'crypto';
import createEvent from 'mock-aws-events';
import { handler as createPaymentHandler } from '../../src/createPayment';
import { getPayment } from '../../src/lib/payments';
import { handler } from '../../src/getPayment';

describe('When the user requests the records for a specific payment', () => {
  it('the requested payment is returned', async () => {
    // create payment
    const paymentId = crypto.randomUUID();
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(paymentId);

    const createPaymentEvent = createEvent('aws:apiGateway', {
      body: JSON.stringify({ currency: 'AUD', amount: 2000 }),
    });

    await createPaymentHandler(createPaymentEvent);

    // get payment by id
    const event = createEvent('aws:apiGateway', {
      pathParameters: {
        id: paymentId,
      },
    });

    const result = await handler(event);

    const payment = await getPayment(paymentId);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toStrictEqual(payment);
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
