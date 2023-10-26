import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { mockProducts } from './mock-products'


const AWSConfig: DynamoDB.Types.ClientConfiguration = {
    region: 'eu-west-1',
};

const dynamoDB = new DynamoDB.DocumentClient(AWSConfig);
const productsTable = 'Products';
const stocksTable = 'Stocks';

async function insertTestData() {
    for (const item of mockProducts) {
        const product_id = uuidv4();

        await dynamoDB
            .put({
                TableName: productsTable,
                Item: {
                    id: product_id,
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    imgSrc: item.imgSrc,
                },
                ConditionExpression: "attribute_not_exists(id)"
            })
            .promise();

        await dynamoDB
            .put({
                TableName: stocksTable,
                Item: {
                    product_id: product_id,
                    count: item.count,
                },
                ConditionExpression: "attribute_not_exists(product_id)"
            })
            .promise();
    }

    console.log('Test data inserted.');
}
insertTestData().catch((error) => console.error(error));
