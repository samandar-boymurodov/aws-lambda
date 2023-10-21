import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {dynamoDbRegion, TABLES} from "@libs/constants";


const dynamoDbClient = new DynamoDBClient({
  region: dynamoDbRegion
});

const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const getProductsList: ValidatedEventAPIGatewayProxyEvent<{}> = async () => {
  const productData = await dynamoDbDocumentClient.send(
      new ScanCommand({ TableName: TABLES.PRODUCTS })
  );

  const stockData = await dynamoDbDocumentClient.send(
      new ScanCommand({ TableName: TABLES.STOCKS })
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
