const express = require('express');
const router = express.Router();
const formid = require('express-formidable');
const categoryController = require('../controllers/categoryControler');

router.post('/create-category', formid(), categoryController.createCategory);
router.put('/update-category/:id', formid(), categoryController.updateCategory);
router.delete('/delete-category/:id', categoryController.deleteCategory);
router.get("/single-category/:id", categoryController.singleCategory);
router.get("/categoryimage/:id", categoryController.singleImage);
router.get("/allcategory", categoryController.allCategory);

module.exports = router;
