const express = require('express');
const router = express.Router();
const controller = require('../controllers/salesController');

router.post('/', controller.createSale);
router.get('/', controller.listSales);

module.exports = router;