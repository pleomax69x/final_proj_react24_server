const Sprint = require("./schemas/sprint-schema");

const createSprint = async (body, projectId) => {
  if (body && projectId) {
    const data = {
      ...body,
      projectId,
    };
    try {
      const sprintData = await new Sprint(data);
      return await sprintData.save();
    } catch (err) {
      return err.message;
    }
  }
};

const removeSprint = async (sprintId) => {
  if (sprintId) {
    try {
      const removedSprint = await Sprint.findByIdAndRemove({
        _id: sprintId,
      });
      return removedSprint;
    } catch (err) {
      return err.message;
    }
  }
};

const changeName = async (title, sprintId) => {
  try {
    const newTitle = await Sprint.findOneAndUpdate(
      { _id: sprintId },
      { title },
      { new: true }
    );

    return newTitle;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  createSprint,
  removeSprint,
  changeName,
};
