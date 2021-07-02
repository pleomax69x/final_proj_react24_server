const Project = require("./schemas/project-schema")
const User = require("./schemas/user-schema");

const createProject = async body => {
  return await Project.create(body)
}

const getProjectById = async (projectId) => {
  return await Project.findOne({ _id: projectId });
}

const getAllProjects = async (projectsId, query) => {
  const {
    limit = 12,
    page = 1,
    sortBy,
    sortByDesc,
    filter,
  } = query

  const optionsSearch = {_id: projectsId}

  const results = await Project.paginate(optionsSearch, {
    limit,
    page,
    select: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  })

  const { docs: projects, totalDocs: total } = results
  return { projects, total, limit, page }
}

const isOwner = async (userId) => {
  return await Project.findOne({ owner: userId })
}

const removeProject = async (userId, projectId) => {
  return await Project.findByIdAndRemove({ _id: projectId, owner: userId })
}

const updateProjectName = async (userId, projectId, body) => {
    return await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { ...body },
    { new: true },
  )
}

module.exports = {
  createProject,
  getProjectById,
  getAllProjects,
  removeProject,
  updateProjectName,
  isOwner,
}