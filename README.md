# Payments API
A payment API that can create a payment, get a single payment and get a list of payments.

## Assumptions
Upon completion of this backend coding test, there were a few assumptions I made about certain aspects of the application. The following assumptions were:
- When creating a payment, I am assuming only a positive value payment can be made (> $0)
- In the cdk file `be-test-stack.ts` the Dynamodb table name was called `PaymentsTable` whereas in the application db layer `payments.ts` the table was called `Payments`. In this case, to address this issue, I updated them all to be `Payments`.
- The declared payment type has the field `id` whereas in the CDK file `be-test-stack.ts` the partition key field in dynamodb table is called `paymentId`. This would cause problems when casting the payment result from dynamodb e.g
```typescript
    result.Item as Payment 
    // the Payment id field here will be undefined
```
To solve this issue, I updated them all to be `id`.
- With the existing endpoints, I noticed the response objects varied slightly in format. For example payment list endpoint returned `{ data: [......] }` where as created endpoint returned `{ result: { ..... }}`. To make it consistent across all endpoints, I decided to update them all to return inside the `data` attribute.  

## Potential Improvements
- To improve logging readability and traceability, I would add in a trace token generation via Node's `async_hooks` and inject it into the logs. This means if we have any issues, it's easier to query the logs via the trace token to get the full understanding of a specific request.   
- Currently, the logs I added are mostly logging the inbound and outbound of a particular request. This could be refactored into some kind of middleware so that it can be applied across any lambda gateway method. Since middlewares are not native to lambdas, we can build it through the composition of higher order functions (more info [here](https://medium.com/@uday.rayala/how-to-create-your-own-aws-lambda-middleware-framework-in-node-js-e65f23bc0ac)) or use some existing npm library.
- Currently, the error responses only return the status code which isn't ideal for the consumer of the API, because they are not aware of the specifics of why its erroring out. To address this problem, we can add an error response in the body for any non-200 statuses, to provide a more comprehensive response to the consumer so they know how to address the error. An example error response might look something like:
```json
{
    error: {
        reasonCode: "NON_POSITIVE_AMOUNT",
        description: "Payment amount needs to have more than 0 dollars"
    }
}
```
- In the `dynamodb.ts` file we have several references to environment variables. In this case, I would consolidate all the `process.env.XXXXX` variables into a config file and use the config in any file that requires the environment variables. The benefit of this is it's easier to refactor down the track if you need to update any of the variables and it's also easy to find out what variables are required when setting up the infrastructure in the cloud.
- Alongside the config file I would probably remove the default config values, manage the variables locally via `dotenv` and throw when an env var is missing. The removal of default config values minimizes the risk of having a scenario where an env var was accidentally missed when setting up the infrastructure and the default value is used, potentially causing issues down the road. My philosophy is when things fail, we want it to fail as fast as possible, so we can address it ASAP. 


## Requirements
- Node 18 or higher
- NPM

To run the integration tests you'll need:
- Docker
- docker-compose

## Installation
Make sure you're running a version of Node that is version 18 or higher. You can run the following command to get the right version: 
```
nvm use 18.18.2
```
Once you have the correct version of Node, we can then install the project dependencies:
```
npm ci
``` 

## Running Tests
##### Unit tests
To run the unit tests we can call the following npm script:
```
npm run test
``` 
##### Integration tests
To run the integration tests we can call the following npm script: 
```
npm run test:int
```
Please note that the first run of these tests may take a little while as the dynamodb-local image needs to be fetched to spin up dynamodb for the tests.