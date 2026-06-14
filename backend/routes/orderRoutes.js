const express = require('express');
const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder
} = require('../controllers/orderController');

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrder);

module.exports = router;
