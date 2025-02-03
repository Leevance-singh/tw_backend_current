const taskModel = require("../models/taskSchema");
const userModel = require("../models/userSchema");
const {getUser} = require("./token");

// const getTasks = async (req, res) => {
//   console.log("inside /gettasks");
//   const user = getUser(req.cookies.mycookie);
//   try {
//     const userdata = await userModel.findById(user.id).populate([{path:"mytasks"},{path:"assignedTasks"}]); 
//     console.log("Tasks from DB ", tasks);
//     // Send tasks to the frontend
//     res.status(200).json({ mytasks:userdata.mytasks,assignedTasks:userdata.assignedTasks});
//   } catch (err) {
//     console.error("Error fetching tasks:", err);
//     res
//       .status(500)
//       .json({ error: "Internal server error. Please try again later." });
//   }
// };
// Add new task 

const addTask = async (req, res) => {
  const user = getUser(req.cookies.mycookie);
  const userId = user.id;
  const {
    tasktitle,
    taskDescription,
    section,
    currentProgress,
    priority,
    comments,
  } = req.body;
  try {
    const newTask = new taskModel({
      tasktitle,
      taskDescription,
      section,
      currentProgress,
      priority,
      comments,
      userId
    });
    const savedTask = await newTask.save();
    if (savedTask) {
      try {
        await userModel.findByIdAndUpdate(
          { _id: user.id },
          {
            $push: { mytasks: savedTask._id },
          }
        );
        res.status(201).json(savedTask);
      } catch (err) {
        console.log("Error in id pushing in sectionModel", err);
      }
    }
    // res.status(201).json(savedTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add task" });
  }
};
// add a new section to existing sections 
const addNewSection =async()=>{
  const user = getUser(req.cookies.mycookie);
  const {section}=req.body;
  try{
    const newSection = await userModel.findByIdAndUpdate({_id:user.id},{
      $addToSet:{sections:section}
    },{new:false})
    if(!newSection.sections.includes(section)){
      res.status(200).json({message:`${section} added successfully!!`});
    }
    else{
      res.status(200).json({message:`${section} already exists!!`});
    }
  }catch(err){
    console.log("Error adding new section: ",err);
    res.status(500).json({ error: "Failed to add section" });
  }

}
module.exports={
    addTask,addNewSection
    // getTasks
}