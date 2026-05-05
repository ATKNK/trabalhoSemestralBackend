const service = require('../services/salesService');

exports.createSale = async (req, res) => {
    try {
        const sale = await service.create(req.body);
        res.status(201).json(sale);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.listSales = async (req, res) => {
    const sales = await service.list();
    res.json(sales);
}