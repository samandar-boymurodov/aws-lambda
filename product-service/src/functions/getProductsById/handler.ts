import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { mockProducts } from '@libs/mock-products'


const getProductsById: ValidatedEventAPIGatewayProxyEvent<{}> = async (event) => {
  const {productId} = event.pathParameters
  const product = mockProducts.find((prd) => prd.id === productId)

  if (product) {
    return formatJSONResponse(product);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Product is not found!'
    })
  }
};

export const main = middyfy(getProductsById);
