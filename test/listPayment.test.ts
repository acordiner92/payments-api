import * as payments from "../src/lib/payments";
import { randomUUID } from "crypto";
import { handler } from "../src/listPayments";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("When the user requests for a list of payments", () => {
  it("Returns all payments if no query parameters are returned", async () => {
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

    const result = await handler({} as unknown as APIGatewayProxyEvent);

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

    const result = await handler({
      queryStringParameters: {
        currency: "SGD",
      },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).data).toStrictEqual([mockPayments[0]]);

    expect(listPaymentMock).toHaveBeenCalledWith("SGD");
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
