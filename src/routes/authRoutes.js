const express = require('express');
const router = express.Router();
const authController = require("../controllers/authControllers");
const formid = require('express-formidable');
const { requireSignIn, isAdmin } = require('../middleware/authMIddleware');

// Auth Routes
router.get('/read', authController.read);
router.post('/register', formid(), authController.register);
router.post('/login',authController.login);
router.delete('/deleteUser/:id',requireSignIn,authController.deleteUser);
router.put('/updateUser/:id',requireSignIn, formid(), authController.updateUser);

// Single Image Route
router.get('/single-image/:id',requireSignIn, authController.singleImage);
router.get('/users',requireSignIn,isAdmin, authController.users);
router.get('/single-user/:id',requireSignIn, authController.user);

// User authentication status route
router.get("/user-auth", requireSignIn, (req, res) => {
    console.log("Verified user:", req.user);
    res.status(200).json({ ok: true });
  });
  router.get("/admin-auth",requireSignIn,isAdmin, (req, res) => {
    console.log("Verified user:", req.user);
    res.status(200).json({ ok: true });
  });
  

module.exports = router;
