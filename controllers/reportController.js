const taskModel = require("../models/taskSchema");
const userModel = require("../models/userSchema");
const { getUser } = require("./token");
const moment = require("moment");  

let report = {
  completed: 0,
  notStarted: 0,
  inProgress: 0,
  dueTasks: 0,
  categoryCount: {},  
  mostCompletedCategory: '',  
};

const generateReport = async (req, res) => {
  console.log("Report being generated, please wait...");

  try {
    const currentDate = moment(); 
    const users = await userModel.find().populate('mytasks');
    
    users.forEach(user => {
      user.mytasks.forEach(task => {
        const progress = task.progress.currProgress;
        
        if (progress === 10) {
          report.completed += 1;
        } else if (progress === 0) {
          report.notStarted += 1;
        } else if (progress >= 1 && progress <= 9) {
          report.inProgress += 1;
        }
        
        if (moment(task.dueDate).isBefore(currentDate)) {
          report.dueTasks += 1;
        }
        
        const category = task.section;
        if (!report.categoryCount[category]) {
          report.categoryCount[category] = 0;
        }
        report.categoryCount[category] += 1;

        if (progress === 10) {
          if (!report.mostCompletedCategory || report.categoryCount[category] > report.categoryCount[report.mostCompletedCategory]) {
            report.mostCompletedCategory = category;
          }
        }
      });
    });

    return res.status(200).json(report);
  } catch (error) {
    console.log("Error generating report:", error);
    return res.status(500).json({ message: "Error generating the report" });
  }
};

module.exports = { generateReport };
