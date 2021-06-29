const Tasks = require("./schemas/task-schema");

const findById = async (id) => {
  return await Tasks.findOne({ _id: id });
};

const createTask = async (body, sprintId) => {
  console.log("id", sprintId);
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

module.exports = {
  findById,
  createTask,
};
