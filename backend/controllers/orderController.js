const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const userId = req.query.userId;
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {};
    if (userId) query.user = userId;
    if (status) query.orderStatus = status;

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create an order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body };
    orderData.statusHistory = [{
      status: 'placed',
      note: 'Your order has been successfully placed.',
      timestamp: new Date()
    }];
    
    const order = await Order.create(orderData);
    // Update stock
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email').lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, ...otherUpdates } = req.body;
    
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    Object.assign(order, otherUpdates);

    if (orderStatus && order.orderStatus !== orderStatus) {
      order.orderStatus = orderStatus;
      
      let note = '';
      switch(orderStatus) {
        case 'confirmed': note = 'Your order has been confirmed by the seller.'; break;
        case 'packed': note = 'Your order has been packed and is ready to be shipped.'; break;
        case 'shipped': note = 'Your order has been dispatched and is on its way.'; break;
        case 'delivered': note = 'Your order has been delivered successfully.'; break;
        case 'cancelled': note = 'Your order has been cancelled.'; break;
        default: note = `Order status updated to ${orderStatus}.`;
      }

      order.statusHistory.push({
        status: orderStatus,
        note: note,
        timestamp: new Date()
      });
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
