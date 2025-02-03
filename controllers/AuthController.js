const { comparePassword } = require("./bcrypt");
const { makeToken } = require("./token");
const userModel = require("../models/userSchema");
const { sendEmail } = require("./MailAuth");
let otpContainer = new Object();
const verifyEmail = async (req, res) => {
  const { email } = req.body;
  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    console.log("User already exists!");
    return res.status(400).json({ message: "User already exists" });
  }
  const otp = await sendEmail(email);
  otpContainer.email = otp;
  const token = makeToken({ email }, true);
  res.cookie("email", token);
  res.status(200).json({ message: "Otp Sent" ,state:true});
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
          res
            .status(200)
            .json({ message: "Login successful", userDetails: user });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      } else {
        res.status(401).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(200).json({ message: "User not found" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("mycookie");
  res.status(200).json({ message: "Logged out successfully" });
};

const signupUser = async (req, res) => {
  console.log("/signup");
  const { otp } = req.body;
  const email = getUser(req.cookies.email);
  if (otpContainer.includes(email) && otpContainer.email == otp) {
    try {
      const newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      var obj = { email: newUser.email, id: newUser._id };
      const token = makeToken(obj);
      res.cookie("mycookie", token);
      res
        .status(201)
        .json({ message: "User created successfully", state: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error creating user" });
    }
  }
  else{
    res.status(400).json({message:"Otp Not Matched",state:false})
  }
};

module.exports = {
  loginUser,
  logoutUser,
  signupUser,
  verifyEmail,
};
