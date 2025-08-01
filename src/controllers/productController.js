const ProductModel = require("../models/productModel");
const path = require("path");
const mongoose = require('mongoose'); 
const OrderModel = require("../models/OrderModel");

// Create a new product
const CreateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;
    const files = req.files;

    // Check if all fields are provided
    if (!name || !description || !price || !category || !quantity || !shipping || !files) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    // Extract filenames from uploaded files
    const photos = [];
    if (files.photo1) photos.push(files.photo1[0].filename);  
    if (files.photo2) photos.push(files.photo2[0].filename);
    if (files.photo3) photos.push(files.photo3[0].filename);
    if (files.photo4) photos.push(files.photo4[0].filename);
    if (files.photo5) photos.push(files.photo5[0].filename);

    // Create new product
    const newProduct = new ProductModel({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      photos, // Save only the filenames
    });

    await newProduct.save();
    return res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};
const allProduct = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await ProductModel.find().populate('category',"categoryName -_id");

    // If no products are found
    if (!products || products.length === 0) {
      return res.status(404).json({ status: "failed", message: "No products found" });
    }

    // Send the products as the response
    return res.status(200).json({ status: "success", data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

const Product = async (req, res) => {
  try {
    const { id } = req.params;

    // Convert `id` to a MongoDB ObjectId
    const product = await ProductModel.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}; 
const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, quantity, shipping } = req.body;
    const files = req.files;

    // Ensure all required fields are present
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    // Find the existing product
    let product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    // Extract filenames from uploaded files and update the photos array
    const photos = product.photos || [];  
    if (files.photo1) photos[0] = files.photo1[0].filename;   
    if (files.photo2) photos[1] = files.photo2[0].filename;   
    if (files.photo3) photos[2] = files.photo3[0].filename;   
    if (files.photo4) photos[3] = files.photo4[0].filename;   
    if (files.photo5) photos[4] = files.photo5[0].filename;   

    // Update product details in the database
    product = await ProductModel.findByIdAndUpdate(
      id,
      { name, description, price, category, quantity, shipping, photos },
      { new: true } // Return the updated product
    );

    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message // Include the error message for debugging
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists before deleting
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    // Delete product
    await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

 
const checkout = async (req, res) => {
  try {
      // Log the request body to check the data
      console.log('Order Data:', req.body);

      // Ensure that all required fields are in the request
      const { fullName, phone, email, city, address, paymentMethod, buyer, cart, totalAmount, totalItems } = req.body;

      if (!email || !fullName || !phone || !city || !address || !paymentMethod || !buyer) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const newOrder = new OrderModel({
          fullName,
          phone,
          email,
          city,
          address,
          paymentMethod,
          buyer,
          cart,
          totalAmount,
          totalItems,
      });

      const order = await newOrder.save();
      res.status(200).json(order);

  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Server error while creating order' });
  }
};




module.exports = { CreateProduct, allProduct, Product, UpdateProduct,deleteProduct,checkout };
