const mongoose = require('mongoose');
const User = require("../models/userModel");
const Product = require("../models/productModel"); // Fixed typo here

const orderSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure buyer is required
    status: {
        type: String,
        default: 'not processing',
        enum: ['not processing', 'processing', 'shipped', 'delivered', 'cancel'],
    },
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        subtotal: { type: Number },
    }],
    totalAmount: { type: Number, required: true },
    totalItems: { type: Number, required: true },
});

  

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;
