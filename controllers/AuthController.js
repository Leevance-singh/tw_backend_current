const { comparePassword, bcryptPassword } = require("./bcrypt");
const { makeToken } = require("./token");
const userModel = require("../models/userSchema");
const otpModel = require("../models/otpSchema");
const { sendEmail } = require("./MailAuth");


const verifyEmail = async (req, res) => {
  const { email } = req.body;
  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    console.log("User already exists!");
    return res.status(400).json({ message: "User already exists" });
  }
  const otp = await sendEmail(email);
  try {
    const otpStored = new otpModel({
      email: email,
      otp: otp,
    });
    await otpStored.save();
    res.status(200).json({ message: "Otp Sent", success: true });
  } catch (error) {
    console.log("Error saving Otp: ", err);
    res.status(500).json({ message: "Otp Sent Failed", success: false });
  }
};

const loginUser = async (req, res) => {
  console.log("inside /login");
  if (validator.isEmail(req.body.email)) {
    try {
      var user = await userModel
        .findOne({ email: req.body.email })
        .populate([{ path: "mytasks" }, { path: "assignedTasks" }]);
      // console.log(user);
      if (user) {
        let check = await comparePassword(req.body.password, user.password); //compare bcrypt pswrd to plain pssword
        if (check) {
          var obj = {
            email: user.email,
            id: user._id,
          };
          const token = makeToken(obj); //create token
          res.cookie("mycookie", token); //store in cookie
          res.status(200).json({
            message: "Login successful",
            userDetails: user,
            success: true,
          });
        } else {
          res.status(401).json({ message: "Invalid password", success: false });
        }
      } else {
        res.status(401).json({ message: "User not found", success: false });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(200).json({ message: "User not found", success: false });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("mycookie");
  res.status(200).json({ message: "Logged out successfully" });
};

const signupUser = async (req, res) => {
  console.log("/signup");
  const { otp, username, email } = req.body;
  //  Sorts documents by createdAt in descending order (latest first).
  const otpData = await otpModel
    .findOne({ email })
    .sort({ createdAt: -1 });
  if (otpData.email == email && otpData.otp == otp) {
    try {
      const password = await bcryptPassword(req.body.password);
      const newUser = new userModel({
        username,
        email,
        password,
      });
      await newUser.save();
      var obj = { email: newUser.email, id: newUser._id };
      const token = makeToken(obj);
      res.cookie("mycookie", token);
      res
        .status(201)
        .json({ message: "User created successfully", success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error creating user",success:false });
    }
  }
  else{
    res.status(400).json({success:false,message:"Otp didnt match!!!"});
  }
};

module.exports = {
  loginUser,
  logoutUser,
  signupUser,
  verifyEmail,
};
