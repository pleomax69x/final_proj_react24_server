const Project = require("./schemas/project-schema")

const createProject = async body => {
  return await Project.create(body)
}

const getProjects = async (userId, query) => {
  const {
    limit = 12,
    page = 1,
    sortBy,
    sortByDesc,
    filter,
  } = query

  const optionsSearch = { owner: userId }

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

const removeProject = async (userId, projectId) => {
  return await Project.findByIdAndRemove({ _id: projectId, owner: userId })
}

const isOwner = async (userId) => {
  const owner = await Project.findOne({ owner: userId })
  if (owner) {
    console.log('owner')
    return true
  }
  return console.log('not owner')
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
  getProjects,
  removeProject,
  updateProjectName,
  isOwner,
}