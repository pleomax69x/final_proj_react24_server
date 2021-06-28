const Joi = require('joi')
const { HttpCode } = require('../../helpers/constants')

const schemaProject = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': `"name" cannot be an empty field`,
      'string.min': `"name" should contains at least 3 characters`,
      'string.max': `"name" limit is 30 characters`,
      'any.required': `"name" is a required field`,
    }),
  description: Joi.string()
    .alphanum()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.min': `"description" should contains at least 5 characters`,
      'string.max': `"description" limit is 100 characters`,
    })
})

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: HttpCode.BAD_REQUEST, message: err.message });
  }
};

module.exports.validateProject = (req, _res, next) => {
  return validate(schemaProject, req.body, next);
}