import * as crypto from "crypto";
import createEvent from "mock-aws-events";
import { handler } from "../../src/createPayment";
import { getPayment } from "../../src/lib/payments";

describe("When the user creates a new payment", () => {
  it("a new payment is created in the db", async () => {
    const paymentId = crypto.randomUUID();
    jest.spyOn(crypto, "randomUUID").mockReturnValue(paymentId);

    const event = createEvent("aws:apiGateway", {
      body: JSON.stringify({ currency: "AUD", amount: 2000 }),
    });

    const { statusCode, body } = await handler(event);

    const payment = await getPayment(paymentId);

    expect(statusCode).toBe(201);
    expect(JSON.parse(body).result).toEqual(paymentId);
    expect(payment).toStrictEqual({
      id: paymentId,
      currency: "AUD",
      amount: 2000,
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
