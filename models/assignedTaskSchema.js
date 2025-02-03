const mongoose = require("mongoose");
const assignTasksSchema = new mongoose.Schema({
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
const assignTasks = mongoose.model("assignTasks", assignTasksSchema);
module.exports = assignTasks;
