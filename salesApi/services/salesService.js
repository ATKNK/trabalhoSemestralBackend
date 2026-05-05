const axios = require('axios');

const CLIENTS_API = 'http://clients_api:3000/';
const PRODUCTS_API = 'http://products_api:3000/';

let sales = [];

exports.create = async ({ client_id, product_id }) => {
    const client = await axios.get(`${CLIENTS_API}/clients/${client_id}`);
    const product = await axios.get(`${PRODUCTS_API}/products/${product_id}`);

    if (!client.data || !product.data) {
        throw new Error('Cliente ou produto inválido');
    }

    const sale = {
        id: sales.lenght++,
        client: client.data,
        product: product.data,
        total: product.data.price
    }

    sales.push(sale);

    return sale;
}

exports.list = async () => {
    return sales;
}