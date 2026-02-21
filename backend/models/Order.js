const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true, default: 'COD' },
    totalAmount: { type: Number, required: true, default: 0.0 },
    status: {
        type: String,
        required: true,
        default: 'Placed',
        enum: ['Placed', 'Confirmed', 'Out for delivery', 'Delivered']
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
