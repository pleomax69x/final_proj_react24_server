const Project = require("./schemas/project-schema");
const Sprint = require("./schemas/sprint-schema");
const Tasks = require("./task-model");
const User = require("./user-model");

const checkIsSprintOwner = async (userId, sprintId) => {
  const finedUser = await User.findById(userId);
  const findSprint = await getSprintById(sprintId);
  const { projectId } = findSprint;
  const findProject = await Project.findById(projectId);
  const { _id } = finedUser;
  const { owner } = findProject;
  const isOwner = _id.toString() === owner.toString();
  return isOwner;
};

const createSprint = async (data) => {
  try {
    const sprintData = await new Sprint(data);
    return await sprintData.save();
  } catch (err) {
    return err.message;
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
    return err.message;
  }
};

const getAllSprints = async (projectId) => {
  try {
    const sprints = await Sprint.find({ projectId: projectId });
    return sprints;
  } catch (err) {
    return err.message;
  }
};

const getSprintById = async (sprintId) => {
  try {
    const sprint = await Sprint.findById({ _id: sprintId });
    return sprint;
  } catch (err) {
    return err.message;
  }
};

const removeSprintAndTasks = async (sprintId) => {
  try {
    await Tasks.removeAllTasksBySprintId(sprintId);
    const removedSprint = await removeSprint(sprintId);
    return removedSprint;
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  createSprint,
  removeSprint,
  changeName,
  getAllSprints,
  getSprintById,
  removeSprintAndTasks,
  checkIsSprintOwner,
};
