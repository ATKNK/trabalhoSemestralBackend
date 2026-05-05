const axios = require('axios');
const pool = require('../database/db');

const CLIENTS_API = 'http://clients_api:3000';
const PRODUCTS_API = 'http://products_api:3000';

const validateSaleInput = ({ client_id, product_id }) => {
  if (!client_id || !product_id) {
    throw new Error('Cliente e produto são obrigatórios');
  }
};

exports.create = async ({ client_id, product_id }) => {
  validateSaleInput({ client_id, product_id });

  const [clientResp, productResp] = await Promise.all([
    axios.get(`${CLIENTS_API}/clients/${client_id}`),
    axios.get(`${PRODUCTS_API}/products/${product_id}`),
  ]);

  const client = clientResp.data;
  const product = productResp.data;

  if (!client || !product) {
    throw new Error('Cliente ou produto inválido');
  }

  if (!client.name || !product.name || product.price == null) {
    throw new Error('Dados do cliente ou produto incompletos');
  }

  if (product.price <= 0) {
    throw new Error('Preço do produto inválido, deve ser maior que zero');
  }

  const existing = await pool.query(
    'SELECT 1 FROM sales WHERE client_id = $1 AND product_id = $2 LIMIT 1',
    [client_id, product_id]
  );

  if (existing.rowCount > 0) {
    throw new Error('Venda duplicada');
  }

  const result = await pool.query(
    'INSERT INTO sales (client_id, product_id, total) VALUES ($1, $2, $3) RETURNING id, client_id, product_id, total, created_at',
    [client_id, product_id, product.price]
  );

  const sale = result.rows[0];

  return {
    id: sale.id,
    client_id: sale.client_id,
    product_id: sale.product_id,
    total: Number(sale.total),
    created_at: sale.created_at,
  };
};

exports.list = async () => {
  const result = await pool.query(
    'SELECT id, client_id, product_id, total, created_at FROM sales ORDER BY created_at DESC'
  );

  return result.rows.map((sale) => ({
    ...sale,
    total: Number(sale.total),
  }));
};