const fs = require('fs');
const fileType = require('file-type');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const { EncodeToken } = require('../helper/tokenHelper');

// Health check endpoint
const read = (req, res) => {
  res.status(200).json({ status: "success", message: "API is working fine" });
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, player } = req.fields;
    const { photo } = req.files;

    if (!photo) {
      return res.status(400).json({ status: "failed", message: "Photo is required" });
    }

    // Check if email already exists
    if (await UserModel.findOne({ email })) {
      return res.status(400).json({ status: "failed", message: "Email is already in use" });
    }

    // Read photo buffer and determine file type
    const photoBuffer = fs.readFileSync(photo.path);
    const type = await fileType.fromBuffer(photoBuffer);
    if (!type) {
      return res.status(400).json({ status: "failed", message: "Invalid file type" });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      player,
      photo: {
        data: photoBuffer,
        contentType: type.mime,
      },
    });

    await user.save();
    res.status(201).json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register:", error.message);
    res.status(500).json({ status: "failed", message: "Internal Server Error", error: error.message });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await UserModel.findOne({ email }).select("-photo");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = EncodeToken(user._id, user.name);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200)
      .header("Authorization", `Bearer ${token}`)
      .json({ message: "Login successful",user,token });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Update user info (including photo upload)
const updateUser = async (req, res) => {
  try {
    const { name, email, password, player } = req.fields;
    const { photo } = req.files;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "failed", message: "Invalid user ID" });
    }

    let updates = { name, email, player };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (photo) {
      const photoBuffer = fs.readFileSync(photo.path);
      const type = await fileType.fromBuffer(photoBuffer);
      if (!type) return res.status(400).json({ status: "failed", message: "Invalid file type" });

      updates.photo = {
        data: photoBuffer,
        contentType: type.mime,
      };
    }

    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user });
  } catch (e) {
    console.error("Error updating user:", e);
    res.status(500).json({ status: "failed", error: e.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "failed", message: "Invalid user ID" });
    }

    const result = await UserModel.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ status: "success", message: "User deleted successfully" });
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({ status: "failed", error: e.message });
  }
};

// Serve user photo
const singleImage = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: "failed", message: "User ID is required" });
  }

  try {
    const user = await UserModel.findById(id).select('photo');
    if (user?.photo?.data) {
      res.set('Content-Type', user.photo.contentType);
      return res.status(200).send(user.photo.data);
    }

    res.status(404).json({ status: "failed", message: "User photo not found" });
  } catch (e) {
    console.error("Error fetching user photo:", e);
    res.status(500).json({ status: "failed", error: e.message });
  }
};

// Get all users
const users = async (req, res) => {
  try {
    const result = await UserModel.find({}).select("-photo -password");
    res.status(200).json({ status: "success", users: result });
  } catch (e) {
    console.error("Error fetching users:", e);
    res.status(500).json({ status: "failed", error: e.message });
  }
};

// Get a specific user by ID
const user = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "failed", message: "Invalid user ID" });
    }

    const result = await UserModel.findById(id).select("-photo -password");
    if (!result) return res.status(404).json({ status: "failed", message: "User not found" });

    res.status(200).json({ status: "success", user: result });
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ status: "failed", error: e.message });
  }
};

module.exports = {
  read,
  register,
  login,
  updateUser,
  deleteUser,
  users,
  user,
  singleImage
};
