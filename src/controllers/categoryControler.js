const categoryModel = require("../models/categoryModel");
const fs = require("fs");
const fileType = require("file-type");
const mongoose = require("mongoose");

const validateAndProcessImage = async (image) => {
  if (!image) {
    return { status: false, message: "No image provided" };
  }

  const photoBuffer = fs.readFileSync(image.path);
  const type = await fileType.fromBuffer(photoBuffer);

  if (!type) {
    return { status: false, message: "Unable to detect file type" };
  }

  return {
    status: true,
    data: {
      data: photoBuffer,
      contentType: type.mime || "application/octet-stream",
    },
  };
};

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.fields;
    const { categoryPhoto } = req.files;

    if (!categoryPhoto) {
      return res.status(400).json({ status: "failed", message: "Photo is required" });
    }

    const existingCategory = await categoryModel.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ status: "failed", message: "Category already exists" });
    }

    const imageValidation = await validateAndProcessImage(categoryPhoto);
    if (!imageValidation.status) {
      return res.status(400).json({ status: "failed", message: imageValidation.message });
    }

    const category = new categoryModel({
      categoryName,
      categoryPhoto: imageValidation.data,
    });

    await category.save();
    res.status(201).json({ status: "success", message: "Category created successfully" });
  } catch (error) {
    console.error("Error in createCategory function:", error.message);
    res.status(500).json({ status: "failed", message: "Internal Server Error", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryName } = req.fields;
    const { categoryPhoto } = req.files;
    const { id } = req.params;

    let photoData = {};
    if (categoryPhoto) {
      const imageValidation = await validateAndProcessImage(categoryPhoto);
      if (!imageValidation.status) {
        return res.status(400).json({ status: "failed", message: imageValidation.message });
      }
      photoData = imageValidation.data;
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(id, { categoryName, categoryPhoto: photoData }, { new: true, runValidators: true });

    if (!updatedCategory) {
      return res.status(404).json({ status: "failed", message: "Category not found" });
    }

    res.status(200).json({ status: "success", data: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ status: "failed", message: "Internal Server Error", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await categoryModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ status: "failed", message: "Category not found" });
    }

    res.status(203).json({ status: "success", message: "Category deleted successfully", result });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ status: "failed", message: "Internal Server Error", error: error.message });
  }
};

const singleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "failed", message: "Invalid category ID" });
    }

    const result = await categoryModel.findById(id).select("-categoryPhoto");

    if (!result) {
      return res.status(404).json({ status: "failed", message: "Category not found" });
    }

    res.status(200).json({ status: "success", category: result });
  } catch (error) {
    console.error("Error fetching category:", error.message);
    res.status(500).json({ status: "failed", message: "Internal Server Error", error: error.message });
  }
};

const singleImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await categoryModel.findById(id).select("categoryPhoto");

    if (image?.categoryPhoto?.data) {
      res.set("Content-Type", image.categoryPhoto.contentType);
      return res.status(200).send(image.categoryPhoto.data);
    } else {
      return res.status(404).json({ status: "failed", message: "Category photo not found" });
    }
  } catch (error) {
    console.error("Error fetching category photo:", error.message);
    res.status(500).json({ status: "failed", message: "Internal Server Error", error: error.message });
  }
};

const allCategory = async (req, res) => {
  try {
    const result = await categoryModel.find({}).select("-categoryPhoto");
    res.status(200).json({ status: "success", allCategory: result });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ status: "failed", message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  singleCategory,
  singleImage,
  allCategory,
};
