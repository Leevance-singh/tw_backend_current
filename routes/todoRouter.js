const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const taskController = require("../controllers/taskController");
const {verifyUser} = require("../middlewares/Authenticate");
router.get('/login',authController.loginUser);
router.post("/addTask",verifyUser,taskController.addTask);
router.post("/addSection",verifyUser,taskController.addNewSection)
module.exports =router