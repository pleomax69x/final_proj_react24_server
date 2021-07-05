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
      console.log(hoursPerDay)
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

    if (task._id) {
      const isOwner = await Sprint.checkIsOwner(
        currentUserId,
        task.projectOwnerId,
      )

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
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'task was not found',
    })
  } catch (err) {
    next(err)
  }
}

const getAllTasks = async (req, res, next) => {
  const sprintId = req.params.sprintId

  try {
    const sprint = await Sprint.getSprintById(sprintId)

    if (sprint._id) {
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
  const taskId = req.params.taskId
  try {
    const changedTask = await Task.changeTaskById(req.body, taskId)
    if (changedTask) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'task was changed',
        data: changedTask,
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

module.exports = {
  addTask,
  deleteTask,
  getAllTasks,
  changeTask,
}
