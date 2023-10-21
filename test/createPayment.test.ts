import * as payments from 'lib/payments';
import * as crypto from 'crypto';
import { handler } from 'src/createPayment';
import createEvent from 'mock-aws-events';

describe('When the user creates a new payment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('A random payment id is generated', async () => {
    const paymentId = crypto.randomUUID();
    const mockPayment = {
      id: crypto.randomUUID(),
      currency: 'AUD',
      amount: 2000,
    };
    const event = createEvent('aws:apiGateway', {
      body: JSON.stringify(mockPayment),
    });

    const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce();

    jest.spyOn(crypto, 'randomUUID').mockReturnValue(paymentId);

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).data.id).toEqual(paymentId);

    expect(createPaymentMock).toHaveBeenCalledWith({
      id: paymentId,
      currency: 'AUD',
      amount: 2000,
    });
  });

  it('Returns 422 if request has invalid currency value', async () => {
    const paymentId = crypto.randomUUID();
    const mockPayment = {
      id: crypto.randomUUID(),
      currency: 123,
      amount: 2000,
    };
    const event = createEvent('aws:apiGateway', {
      body: JSON.stringify(mockPayment),
    });
    const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce();

    jest.spyOn(crypto, 'randomUUID').mockReturnValue(paymentId);

    const result = await handler(event);

    expect(result.statusCode).toBe(422);
    expect(result.body).toEqual('');

    expect(createPaymentMock).not.toBeCalled();
  });

  it.each(['invalidAmount', 0, -10])(
    'Returns 422 if request has invalid amount value',
    async amount => {
      const paymentId = crypto.randomUUID();
      const mockPayment = {
        id: crypto.randomUUID(),
        currency: 'AUD',
        amount,
      };
      const event = createEvent('aws:apiGateway', {
        body: JSON.stringify(mockPayment),
      });
      const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce();

      jest.spyOn(crypto, 'randomUUID').mockReturnValue(paymentId);

      const result = await handler(event);

      expect(result.statusCode).toBe(422);
      expect(result.body).toEqual('');

      expect(createPaymentMock).not.toBeCalled();
    },
  );

  it('Returns 400 if request body is empty', async () => {
    const paymentId = crypto.randomUUID();
    const event = createEvent('aws:apiGateway', {});
    const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce();

    jest.spyOn(crypto, 'randomUUID').mockReturnValue(paymentId);

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual('');

    expect(createPaymentMock).not.toBeCalled();
  });

  it('Returns 400 if request body is invalid json', async () => {
    const paymentId = crypto.randomUUID();
    const event = createEvent('aws:apiGateway', {
      body: 'some random value',
    });
    const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce();

    jest.spyOn(crypto, 'randomUUID').mockReturnValue(paymentId);

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual('');

    expect(createPaymentMock).not.toBeCalled();
  });
});
