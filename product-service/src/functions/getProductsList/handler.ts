import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const awsRegion = 'eu-west-1';

const dynamoDbClient = new DynamoDBClient({
  region: awsRegion
});

const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const getProductsList: ValidatedEventAPIGatewayProxyEvent<{}> = async () => {
  const productData = await dynamoDbDocumentClient.send(
      new ScanCommand({ TableName: 'Products' })
  );

  const stockData = await dynamoDbDocumentClient.send(
      new ScanCommand({ TableName: 'Stocks' })
  );

  const combinedData = productData.Items?.map((product) => {
    const stockItem = stockData.Items?.find(
        (stock) => stock.product_id === product.id
    );

    return {
      ...product,
      count: stockItem?.count,
    };
  });

  return formatJSONResponse(combinedData);
};

export const main = middyfy(getProductsList);
