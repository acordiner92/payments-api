import * as crypto from 'crypto';
import createEvent from 'mock-aws-events';
import { handler as createPaymentHandler } from 'src/createPayment';
import { getPayment } from 'lib/payments';
import { handler } from 'src/getPayment';

describe('When the user requests the records for a specific payment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    expect(JSON.parse(result.body).data).toStrictEqual(payment);
  });

  it('a 400 is returned if no id is present in request', async () => {
    // create payment
    const paymentId = crypto.randomUUID();
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(paymentId);

    const createPaymentEvent = createEvent('aws:apiGateway', {
      body: JSON.stringify({ currency: 'AUD', amount: 2000 }),
    });

    await createPaymentHandler(createPaymentEvent);

    // get payment by id
    const event = createEvent('aws:apiGateway', {
      pathParameters: {},
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toStrictEqual('');
  });
});
