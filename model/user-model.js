const User = require("./schemas/user-schema");

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (data) => {
  const user = await new User(data);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

// TODO:
const addProjectToUser = async (userId, projectId) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { projectsId: projectId } }
  );
};

const findByProjectsId = async (userId, projectId) => {
  const user = await User.findById(userId);
  const projectsId = user.projectsId;
  return projectsId.find((id) => id === projectId);
};

const removeUserFromProject = async (userId, projectId) => {
  const user = await findById(userId);
  const projectsId = user.projectsId;
  const newProjectsId = projectsId.filter((id) => id !== projectId);
  return await updateUserProjects(userId, newProjectsId);
};

const updateUserProjects = async (userId, projectsId) => {
  return await User.updateOne({ _id: userId }, { projectsId }, { new: true });
};

module.exports = {
  findById,
  findByEmail,
  createUser,
  updateToken,
  findByProjectsId,
  removeUserFromProject,
  updateUserProjects,
  addProjectToUser,
};
