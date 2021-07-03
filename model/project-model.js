const Project = require("./schemas/project-schema");

const createProject = async (body) => {
  return await Project.create(body);
};

const getProjectById = async (projectId) => {
  return await Project.findOne({ _id: projectId });
};

const getAllProjects = async (userId, projectsId, query) => {
  const { limit = 12, page = 1, sortBy, sortByDesc, filter } = query;

  const optionsSearch = { owner: userId };
  // когда будет готова функция добавления человека в проект
  //const optionsSearch = { _id: projectsId }

  const results = await Project.paginate(optionsSearch, {
    limit,
    page,
    select: filter ? filter.split("|").join(" ") : "",
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  });

  const { docs: projects, totalDocs: total } = results;
  return { projects, total, limit, page };
};

const isOwner = async (userId) => {
  return await Project.findOne({ owner: userId });
};

const removeProject = async (userId, projectId) => {
  return await Project.findByIdAndRemove({ _id: projectId, owner: userId });
};

const updateProjectName = async (userId, projectId, body) => {
  return await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { ...body },
    { new: true }
  );
};

const addTeammateToProject = async (userId, projectId) => {
  return await Project.updateOne(
    { _id: projectId },
    { $push: { teammatesId: userId } }
  );
};

module.exports = {
  createProject,
  getProjectById,
  getAllProjects,
  removeProject,
  updateProjectName,
  isOwner,
  addTeammateToProject,
};
