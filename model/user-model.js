const { find } = require("./schemas/user-schema");
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

const addUserToProject = async (userId, projectId) => { }

const findByProjectsId = async (userId, projectId) => {
  const user = await User.findById(userId)
  const projectsId = user.projectsId
  const result = projectsId.find(id => id === projectId)
  if (!result) {
    return false
  }
  return result
}

module.exports = {
  findById,
  findByEmail,
  createUser,
  updateToken,
  addUserToProject,
  findByProjectsId,
};
