const Sprint = require('../model/sprint-model')
const Task = require('../model/task-model')
const { HttpCode } = require('../helpers/constants')

const addTask = async (req, res, next) => {
  const sprintId = req.params.sprintId
  const currentUser = req.user.id

  try {
    const sprint = await Sprint.getSprintById(sprintId)

    if (sprint._id) {
      let hoursPerDay = []

      sprint.listOfDates.map(date => {
        let data = { date, hours: 0 }
        hoursPerDay.push(data)
      })

      const data = {
        ...req.body,
        hoursPerDay,
        projectOwnerId: sprint.projectOwnerId,
        sprintId,
      }

      const newTask = await Task.createTask(data)

      if (newTask._id) {
        return res.status(HttpCode.CREATED).json({
          status: 'Created',
          code: HttpCode.CREATED,
          data: {
            newTask,
          },
        })
      } else
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          status: 'fail',
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'task was not created',
        })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'sprint was not found',
    })
  } catch (err) {
    next(err.message)
  }
}

const deleteTask = async (req, res, next) => {
  const currentUserId = req.user.id
  const taskId = req.params.taskId

  try {
    const task = await Task.findById(taskId)

    if (task === null) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'task was not found',
      })
    }

    const ownerId = task.projectOwnerId.toString()
    const isOwner = ownerId === currentUserId

    if (isOwner) {
      const deletedTask = await Task.removeTask(taskId)

      if (deletedTask._id) {
        const { _id, title, sprintId } = deletedTask
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          message: 'task was deleted',
          data: {
            task: {
              id: _id,
              title,
              sprintId,
            },
          },
        })
      } else {
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          status: 'fail',
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'task was not deleted',
        })
      }
    }
    return res.status(HttpCode.FORBIDDEN).json({
      status: 'error',
      code: HttpCode.FORBIDDEN,
      message: 'only project owner can delete task',
    })
  } catch (err) {
    next(err)
  }
}

const getAllTasks = async (req, res, next) => {
  const sprintId = req.params.sprintId

  try {
    const sprint = await Sprint.getSprintById(sprintId)

    if (sprint !== null) {
      const tasks = await Task.getAllTaskBySprintId(sprintId)

      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          sprint,
          tasks,
        },
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'sprint was not found',
    })
  } catch (err) {
    next(err)
  }
}

const changeTask = async (req, res, next) => {
  const { taskId } = req.params
  const { hoursPerDay } = req.body

  try {
    const changeHours = await Task.changeHours(taskId, hoursPerDay)

    if (changeHours.nModified > 0) {
      const { hoursPerDay } = await Task.findById(taskId)

      const totalHours = hoursPerDay.reduce((total, current) => {
        return total + current.hours
      }, 0)

      const chahgeTotalHours = await Task.changeTotal(taskId, totalHours)

      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'task was changed',
        data: chahgeTotalHours,
      })
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: 'task was not change',
    })
  } catch (err) {
    next(err.message)
  }
}

const changescheduledHours = async (req, res, next) => {
  const { taskId } = req.params
  const { scheduledHours } = req.body

  try {
    const task = await Task.findById(taskId)

    if (task) {
      const changeHours = await Task.changeScheduledHours(
        taskId,
        scheduledHours,
      )

      if (changeHours._id) {
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          message: 'scheduledHours was changed',
          data: {
            taskId,

            scheduledHours: changeHours.scheduledHours,
          },
        })
      }
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'fail',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'scheduledHours was not change',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'task was not found',
    })
  } catch (err) {
    next(err.message)
  }
}

module.exports = {
  addTask,
  deleteTask,
  getAllTasks,
  changeTask,
  changescheduledHours,
}
