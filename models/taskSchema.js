// Schema for task
const mongoose = require("mongoose"); //firstly require the module moongose its third party which we had installed
const tasks = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  tasktitle: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  section: [{
    type: String,
    default: "todo",
  }],
  currentProgress: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  assignDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  comments: [
    {
      username: {
        type: String,
      },
      comment: {
        type: String,
      },
      timestamp: {
        type: String,
      },
    },
  ],
  isDisable:{
    type:Boolean,
    default:false
  },
  
},{timestamps:true});
const taskModel = mongoose.model("tasks", tasks);
module.exports = taskModel;
