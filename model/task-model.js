const Tasks = require('./schemas/task-schema')

const findById = async id => {
  return await Tasks.findOne({ _id: id })
}

const createTask = async data => {
  try {
    const newTask = await new Tasks(data)
    return await newTask.save()
  } catch (err) {
    return err.message
  }
}

const removeTask = async taskId => {
  if (taskId) {
    try {
      const task = await Tasks.findByIdAndRemove({
        _id: taskId,
      })
      return task
    } catch (err) {
      return err.message
    }
  }
}

const removeAllTasksBySprintId = async sprintId => {
  if (sprintId) {
    try {
      const removedTasks = await Tasks.deleteMany({
        sprintId: sprintId,
      })
      return removedTasks
    } catch (err) {
      return err.message
    }
  }
}

const getAllTaskBySprintId = async sprintId => {
  if (sprintId) {
    try {
      const tasks = await Tasks.find({ sprintId: sprintId })
      return tasks
    } catch (err) {
      return err.message
    }
  }
}

const changeScheduledHours = async (taskId, scheduledHours) => {
  if (taskId) {
    try {
      const result = await Tasks.findOneAndUpdate(
        { _id: taskId },
        { scheduledHours },
        { new: true },
      )
      return result
    } catch (err) {
      return err.message
    }
  }
}

const changeHours = async (taskId, hoursPerDay) => {
  if ((taskId, hoursPerDay)) {
    const { date, hours } = hoursPerDay

    const result = await Tasks.updateOne(
      { _id: taskId, 'hoursPerDay.date': date },
      {
        $set: { 'hoursPerDay.$.hours': hours },
      },
    )
    return result
  }
}

const changeTotal = async (taskId, totalHours) => {
  const result = await Tasks.findOneAndUpdate(
    { _id: taskId },
    { totalHours },
    { new: true },
  )
  return result
}

module.exports = {
  findById,
  createTask,
  removeTask,
  removeAllTasksBySprintId,
  getAllTaskBySprintId,
  changeScheduledHours,
  changeHours,
  changeTotal,
}
