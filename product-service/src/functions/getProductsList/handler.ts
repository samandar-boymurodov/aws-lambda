import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { mockProducts } from '@libs/mock-products'


const getProductsList: ValidatedEventAPIGatewayProxyEvent<{}> = async () => {
  return formatJSONResponse(mockProducts);
};

export const main = middyfy(getProductsList);
