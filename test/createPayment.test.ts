import * as payments from "../src/lib/payments";
import * as crypto from "crypto";
import { handler } from "../src/createPayment";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("When the user creates a new payment", () => {
  it("A random payment id is generated", async () => {
    const paymentId = crypto.randomUUID();
    const mockPayment = {
      id: crypto.randomUUID(),
      currency: "AUD",
      amount: 2000,
    };
    const createPaymentMock = jest
      .spyOn(payments, "createPayment")
      .mockResolvedValueOnce();

    jest.spyOn(crypto, "randomUUID").mockReturnValue(paymentId);

    const result = await handler({
      body: JSON.stringify(mockPayment),
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).result).toEqual(paymentId);

    expect(createPaymentMock).toHaveBeenCalledWith({
      id: paymentId,
      currency: "AUD",
      amount: 2000,
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
