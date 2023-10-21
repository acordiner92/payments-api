import * as payments from "../src/lib/payments";
import { randomUUID } from "crypto";
import { handler } from "../src/listPayments";
import createEvent from "mock-aws-events";

describe("When the user requests for a list of payments", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("All payments are returned if no query parameters are provided", async () => {
    const mockPayments = [
      {
        id: randomUUID(),
        currency: "AUD",
        amount: 2000,
      },
      {
        id: randomUUID(),
        currency: "AUD",
        amount: 2000,
      },
    ];
    const listPaymentMock = jest
      .spyOn(payments, "listPayments")
      .mockResolvedValueOnce(mockPayments);

    const event = createEvent("aws:apiGateway", {});

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).data).toStrictEqual(mockPayments);

    expect(listPaymentMock).toHaveBeenCalledWith(undefined);
  });

  it("Returns only SGD currency payments if user requests SGD", async () => {
    const mockPayments = [
      {
        id: randomUUID(),
        currency: "AUD",
        amount: 2000,
      },
      {
        id: randomUUID(),
        currency: "SGD",
        amount: 1000,
      },
    ];
    const listPaymentMock = jest
      .spyOn(payments, "listPayments")
      .mockResolvedValueOnce([mockPayments[0]]);

    const event = createEvent("aws:apiGateway", {
      queryStringParameters: {
        currency: "SGD",
      },
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).data).toStrictEqual([mockPayments[0]]);

    expect(listPaymentMock).toHaveBeenCalledWith("SGD");
  });
});
