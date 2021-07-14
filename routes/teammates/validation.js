const Joi = require('joi')
const { HttpCode } = require('../../helpers/constants')

const schemaAddTeammate = Joi.object({
  email: Joi.string().required(),
  projectId: Joi.string().required(),
})

const addValidate = async (
  schema,
  { body: { email }, params: { projectId } },
  next,
) => {
  try {
    const data = {
      email,
      projectId,
    }
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

module.exports.validateAddTeammate = (req, _res, next) => {
  return addValidate(schemaAddTeammate, req, next)
}
