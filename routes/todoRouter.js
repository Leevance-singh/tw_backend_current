const express = require("express");

const router = express.Router();

const authController = require("../controllers/AuthController");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/Authenticate");


router.get('/auth/checkToken',authMiddleware.checkLoginStatus);
router.post("/verifyEmail",authController.verifyEmail);
router.post("/signup",authController.signupUser);
router.get('/login',authController.loginUser);
router.post("/addTask",authMiddleware.verifyUser,taskController.addTask);
router.post("/addSection",authMiddleware.verifyUser,taskController.addNewSection);

module.exports =router