const Project = require('./schemas/project-schema')

const createProject = async body => {
  return await Project.create(body)
}

const getProjectById = async projectId => {
  return await Project.findOne({ _id: projectId })
}

const getAllProjects = async (projectsId, query) => {
  const { limit = 12, page = 1, sortBy, sortByDesc, filter } = query

  const optionsSearch = { _id: projectsId }

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

const isOwner = async (projectId, userId) => {
  const project = await getProjectById(projectId)
  return project.owner.toString() === userId
}

const isTeammate = async (userId, projectId) => {
  const result = await Project.findOne({
    _id: projectId,
    teammates: {
      $elemMatch: { id: userId },
    },
  })
  return result
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

const addTeammateToProject = async (user, projectId) => {
  const data = {
    email: user.email,
    id: user._id,
  }

  return await Project.updateOne(
    { _id: projectId },
    { $push: { teammates: data } },
  )
}

module.exports = {
  createProject,
  getProjectById,
  getAllProjects,
  removeProject,
  updateProjectName,
  isOwner,
  addTeammateToProject,
  isTeammate,
}
