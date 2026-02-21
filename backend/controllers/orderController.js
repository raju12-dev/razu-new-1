const Order = require('../models/Order');

// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, address, totalAmount, paymentMethod } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            userId: req.user._id,
            items,
            address,
            paymentMethod,
            totalAmount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/orders/user/:userId
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        // Only allow user to view their own orders unless admin
        if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createOrder, getUserOrders, getOrders, updateOrderStatus };
