import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";

const awsRegion = 'eu-west-1';

const dynamoDbClient = new DynamoDBClient({
  region: awsRegion
});

const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const getProductsById: ValidatedEventAPIGatewayProxyEvent<{}> = async (event) => {
  const {productId} = event.pathParameters

  const params = {
    TableName: 'Products',
    Key: {
      id: productId,
    },
  };

  try {
    const result = await dynamoDbDocumentClient.send(new GetCommand(params));

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching data from DynamoDB',
      }),
    };
  }
};

export const main = middyfy(getProductsById);
