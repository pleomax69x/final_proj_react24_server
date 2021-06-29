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

module.exports = {
  findById,
  createTask,
  removeTask,
};
