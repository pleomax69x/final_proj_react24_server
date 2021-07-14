const Joi = require('joi')
const { HttpCode } = require('../../helpers/constants')

const schemaProject = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': `The Name field cannot be empty`,
    'string.min': `The Name field should contains at least 3 characters`,
    'string.max': `The Name field limit is 30 characters`,
    'any.required': `The Name field is required`,
  }),
  description: Joi.string().min(5).max(100).required().messages({
    'string.empty': `The Description field cannot be empty`,
    'string.min': `The Description field should contains at least 5 characters`,
    'string.max': `The Description field limit is 100 characters`,
    'any.required': `The Description field is required`,
  }),
})

const schemaChangeProjectName = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': `The Name field cannot be empty`,
    'string.min': `The Name field should contains at least 3 characters`,
    'string.max': `The Name field limit is 30 characters`,
    'any.required': `The Name field is required`,
  }),
})

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body)
    next()
  } catch (err) {
    next({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: err.message,
    })
  }
}

const validateProject = (req, _res, next) => {
  return validate(schemaProject, req.body, next)
}

const validateChangeProjectName = (req, _res, next) => {
  return validate(schemaChangeProjectName, req.body, next)
}

module.exports = {
  validateProject,
  validateChangeProjectName,
}
