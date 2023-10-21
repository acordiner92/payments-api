import createEvent from "mock-aws-events";
import * as crypto from "crypto";
import { handler as createPaymentHandler } from "../../src/createPayment";
import { handler } from "../../src/listPayments";

describe("When the user requests for a list of payments", () => {
  afterEach(() => jest.clearAllMocks());

  it("All payments are returned if no query parameters are provided", async () => {
    // create payments
    const paymentOneId = crypto.randomUUID();
    const paymentTwoId = crypto.randomUUID();
    jest
      .spyOn(crypto, "randomUUID")
      .mockReturnValueOnce(paymentOneId)
      .mockReturnValueOnce(paymentTwoId);

    const paymentOne = createEvent("aws:apiGateway", {
      body: JSON.stringify({ currency: "AUD", amount: 1000 }),
    });

    const paymentTwo = createEvent("aws:apiGateway", {
      body: JSON.stringify({ currency: "SGD", amount: 250 }),
    });

    await createPaymentHandler(paymentOne);
    await createPaymentHandler(paymentTwo);

    // get payments
    const event = createEvent("aws:apiGateway", {});

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(new Set(JSON.parse(result.body).data)).toMatchObject(
      new Set([
        { id: paymentOneId, currency: "AUD", amount: 1000 },
        { id: paymentTwoId, currency: "SGD", amount: 250 },
      ])
    );
  });

  it("Returns only SGD currency payments if user requests SGD", async () => {
    // create payments
    const paymentOneId = crypto.randomUUID();
    const paymentTwoId = crypto.randomUUID();
    jest
      .spyOn(crypto, "randomUUID")
      .mockReturnValueOnce(paymentOneId)
      .mockReturnValueOnce(paymentTwoId);

    const paymentOne = createEvent("aws:apiGateway", {
      body: JSON.stringify({ currency: "AUD", amount: 1000 }),
    });

    const paymentTwo = createEvent("aws:apiGateway", {
      body: JSON.stringify({ currency: "SGD", amount: 250 }),
    });

    await createPaymentHandler(paymentOne);
    await createPaymentHandler(paymentTwo);

    // get payments
    const event = createEvent("aws:apiGateway", {
      queryStringParameters: {
        currency: "SGD",
      },
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).data).toStrictEqual([
      { id: paymentTwoId, currency: "SGD", amount: 250 },
    ]);
  });
});
