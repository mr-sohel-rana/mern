require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require('morgan');
const fs = require('fs');
const multer = require('./src/multer/multer');

const app = express();

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.json()); // JSON parser

// Rate Limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/MERNECOM';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// API Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", productRoutes);

// Serve static files from 'uploads' directory for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure `uploads` Directory Exists
const uploadDir = path.join(__dirname, 'uploads');
fs.promises.mkdir(uploadDir, { recursive: true })
  .then(() => console.log('Uploads directory is ready'))
  .catch(err => console.error('Error creating uploads directory:', err));

// Multer Setup for File Uploads
const multiple = multer.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 },
  { name: 'photo5', maxCount: 1 }
]);

// Upload Route
app.post('/uploads', multiple, (req, res) => {
  if (!req.files) return res.status(400).json({ message: "No files uploaded" });
  res.json({ message: "Files uploaded successfully", files: req.files });
});

// Serve React Frontend
app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")));

// Invalid Route Handling
app.use("*", (req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;
