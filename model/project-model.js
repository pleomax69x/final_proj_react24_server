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

module.exports = {
  createProject,
  getProjects,
  removeProject,
}