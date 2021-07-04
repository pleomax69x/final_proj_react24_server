const Sprint = require('./schemas/sprint-schema')
const Tasks = require('./task-model')

const checkIsOwner = async (userId, sprintId) => {
  return sprintId.toString() === userId
}

const createSprint = async data => {
  try {
    const sprintData = await new Sprint(data)
    return await sprintData.save()
  } catch (err) {
    return err.message
  }
}

const removeSprint = async sprintId => {
  if (sprintId) {
    try {
      const removedSprint = await Sprint.findByIdAndRemove({
        _id: sprintId,
      })
      return removedSprint
    } catch (err) {
      return err.message
    }
  }
}

const changeName = async (title, sprintId) => {
  try {
    const newTitle = await Sprint.findOneAndUpdate(
      { _id: sprintId },
      { title },
      { new: true },
    )

    return newTitle
  } catch (err) {
    return err.message
  }
}

const getAllSprints = async projectId => {
  try {
    const result = await Sprint.find({ projectId: projectId })
    return result
  } catch (err) {
    return err.message
  }
}

const getSprintById = async sprintId => {
  try {
    const sprint = await Sprint.findById({ _id: sprintId })
    return sprint
  } catch (err) {
    return err.message
  }
}

const removeSprintAndTasks = async sprintId => {
  try {
    await Tasks.removeAllTasksBySprintId(sprintId)
    const removedSprint = await removeSprint(sprintId)
    return removedSprint
  } catch (err) {
    return err.message
  }
}

module.exports = {
  createSprint,
  removeSprint,
  changeName,
  getAllSprints,
  getSprintById,
  removeSprintAndTasks,
  checkIsOwner,
}
