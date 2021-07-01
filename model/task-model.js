const Tasks = require("./schemas/task-schema");

const findById = async (id) => {
  return await Tasks.findOne({ _id: id });
};

const createTask = async (body, sprintId) => {
  if (body && sprintId) {
    const data = {
      ...body,
      sprintId,
    };
    try {
      const taskData = await new Tasks(data);
      return await taskData.save();
    } catch (err) {
      return err.message;
    }
  }
};

const removeTask = async (taskId) => {
  if (taskId) {
    try {
      const task = await Tasks.findByIdAndRemove({
        _id: taskId,
      });
      return task;
    } catch (err) {
      return err.message;
    }
  }
};

const removeAllTasksBySprintId = async (sprintId) => {
  if (sprintId) {
    try {
      const removedTasks = await Tasks.deleteMany({
        sprintId: sprintId,
      });
      return removedTasks;
    } catch (err) {
      return err.message;
    }
  }
};

const getAllTaskBySprintId = async (sprintId) => {
  if (sprintId) {
    try {
      const tasks = await Tasks.find({ sprintId: sprintId });
      return tasks;
    } catch (err) {
      return err.message;
    }
  }
};

const changeTaskById = async (body, taskId) => {
  if (taskId) {
    try {
      const changedTask = await Tasks.findOneAndUpdate(
        { _id: taskId },
        { ...body },
        { new: true }
      );
      return changedTask;
    } catch (err) {
      return err.message;
    }
  }
};

module.exports = {
  findById,
  createTask,
  removeTask,
  removeAllTasksBySprintId,
  getAllTaskBySprintId,
  changeTaskById,
};
