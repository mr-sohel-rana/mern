const mongoose = require("mongoose");
const Category=require('../models/categoryModel')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  quantity: { type: Number, required: true },
  shipping: { type: Boolean, required: true },
  photos: { type: [String], required: true },  // Array of filenames for images
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
