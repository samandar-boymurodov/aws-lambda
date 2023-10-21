import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import {DynamoDBDocumentClient, PutCommand, PutCommandInput} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid';
import schema from "./schema";
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {dynamoDbRegion, TABLES} from "@libs/constants";

const dynamoDbClient = new DynamoDBClient({
  region: dynamoDbRegion
});

const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { body } = event

  const item = {
    id: uuidv4(),
    title: body.title,
    price: body.price,
    description: body.description,
    imgSrc: body.imgSrc,
  };

  const params: PutCommandInput = {
    TableName: TABLES.PRODUCTS,
    Item: marshall(item),
  };

  try {
    await dynamoDbDocumentClient.send(new PutCommand(params));
    return formatJSONResponse(item)
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error while creating the product',
      }),
    };
  }
};

export const main = middyfy(createProduct);
