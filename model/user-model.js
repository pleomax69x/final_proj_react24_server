const User = require('./schemas/user-schema')

const findById = async id => {
  return await User.findOne({ _id: id })
}

const findByEmail = async email => {
  return await User.findOne({ email })
}

const findByProjectsId = async (userId, projectId) => {
  const user = await findById(userId)
  const projectsId = user.projectsId
  return projectsId.find(id => id === projectId)
}

const createUser = async data => {
  const user = await new User(data)
  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const addProjectToUser = async (userId, projectId) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { projectsId: projectId } },
  )
}

const removeProjectFromUser = async (userId, projectId) => {
  const user = await findById(userId)
  const projectsId = user.projectsId
  const newProjectsId = projectsId.filter(id => id !== projectId)
  return await updateUserProjects(userId, newProjectsId)
}

const updateUserProjects = async (userId, projectsId) => {
  return await User.updateOne({ _id: userId }, { projectsId }, { new: true })
}

const removeProjectFromAllUsers = async (teammatesId, projectId) => {
  const users = await User.find({ _id: { $in: teammatesId } })

  return await users.map(user => {
    removeProjectFromUser(user.id, projectId)
  })
}

const removeProjects = async projectId => {
  const users = await User.updateMany(
    { projectsId: projectId },
    {
      $pull: {
        projectsId: projectId,
      },
    },
    { new: true },
  )
  return users
}

module.exports = {
  findById,
  findByEmail,
  findByProjectsId,
  createUser,
  updateToken,
  addProjectToUser,
  removeProjectFromUser,
  updateUserProjects,
  removeProjectFromAllUsers,
  removeProjects,
}
