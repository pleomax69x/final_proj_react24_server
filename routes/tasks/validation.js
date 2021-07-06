const Joi = require('joi')
const { HttpCode } = require('../../helpers/constants')

const schemaCreateTask = Joi.object({
  title: Joi.string().required(),
  scheduledHours: Joi.number().required(),
  sprintId: Joi.string().required(),
})

const schemaDeleteTask = Joi.object({
  taskId: Joi.string().required(),
})

const schemaGetAllTasks = Joi.object({
  sprintId: Joi.string().required(),
})

const schemaChangeTask = Joi.object({
  hoursPerDay: Joi.object().required(),
  taskId: Joi.string().required(),
  totalHours: Joi.number(),
})

const validateCreate = async (schema, body, { sprintId }, next) => {
  const data = {
    ...body,
    sprintId,
  }
  try {
    await schema.validateAsync(data)

    next()
  } catch (err) {
    next({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: err.message,
    })
  }
}

const validateDel = async (schema, { taskId }, next) => {
  try {
    await schema.validateAsync(taskId)

    next()
  } catch (err) {
    next({
      status: 'fail',
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    })
  }
}

const validateGetTask = async (schema, { sprintId }, next) => {
  try {
    await schema.validateAsync(sprintId)
    next()
  } catch (err) {
    next({
      status: 'fail',
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    })
  }
}

const validateChange = async (schema, body, { taskId }, next) => {
  const data = {
    ...body,
    taskId,
  }
  try {
    await schema.validateAsync(data)
    next()
  } catch (err) {
    next({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: err.message,
    })
  }
}

module.exports.validateCreateTask = (req, _res, next) => {
  return validateCreate(schemaCreateTask, req.body, req.params, next)
}

module.exports.validateDeleteTask = (req, _res, next) => {
  return validateDel(schemaDeleteTask, req.params.taskId, next)
}

module.exports.validateGetTasks = (req, _res, next) => {
  return validateGetTask(schemaGetAllTasks, req.params.sprintId, next)
}

module.exports.validateChangeTask = (req, _res, next) => {
  return validateChange(schemaChangeTask, req.body, req.params, next)
}
