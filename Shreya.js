const updateTask = async (req, res) => {
  const {
    taskId,
    tasktitle,
    taskDescription,
    section,
    currentProgress,
    priority,
    comments,
  } = req.body;
  try {
    const newTask = await taskModel.findByIdAndUpdate(
      taskId,
      {
        tasktitle,
        taskDescription,
        section,
        currentProgress,
        priority,
        comments,
      },
      { new: true }
    );
    if (newTask) {
      res
        .status(200)
        .json({message: "Task updated successfully",success:true});
    }
    // res.status(201).json(savedTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add task",success:false});
  }
};
