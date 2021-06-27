const Project = require("./schemas/project-schema")

const createProject = async body => {
  return await Project.create(body)
}

module.exports = {
  createProject,
}