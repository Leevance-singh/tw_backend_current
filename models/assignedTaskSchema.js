const mongoose = require("mongoose");
const assignTasks = new mongoose.Schema({
  assignerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  assignDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    default: Date.now,
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasks",
  }]
});
const assignModel = mongoose.model("assignTasks", assignTasks);
module.exports = assignModel;
