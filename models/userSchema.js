const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB is not connected:", err);
  });

const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
  },
  mytasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
  assignedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
  sections: [
    {
      type: String,
      unique: true,
      default:['todo','inProgress','completed']
    },
  ],
});

// Commonly used for validations , checking documents before saving
User.pre("save", function (next) {
  //this refres to mongoose document
  // here we check if both are empty
  if (!this.password && !this.googleId) {
    return next(new Error("Either password or googleId must be provided."));
  }
  //next works if any of both  field is present
  next();
});

const userModel = mongoose.model("users", User);

module.exports = userModel;
