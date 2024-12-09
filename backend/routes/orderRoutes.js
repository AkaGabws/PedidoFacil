const express = require('express');
const { createOrder } = require('./controllers/orderController');

const route = express.Router();
route.post('/', createOrder);

module.exports = router;
