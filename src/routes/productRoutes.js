const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../multer/multer");

// Create product with multiple images
router.post("/products", upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 },
  { name: 'photo5', maxCount: 1 }
]), productController.CreateProduct);
router.put("/product-update/:id", upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 },
  { name: 'photo5', maxCount: 1 }
]), productController.UpdateProduct);


// Get a single image from the product by ID and index
router.get('/allproduct', productController.allProduct);
router.get('/single-product/:id', productController.Product);
router.delete("/product-delete/:id",productController.deleteProduct)

router.post('/checkout',productController.checkout)

module.exports = router;
