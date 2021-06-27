const Joi = require('joi')

const schemaProject = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .required(),
  description: Joi.string()
    .min(3)
    .max(100)
})

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

module.exports.validateProject = (req, _res, next) => {
  return validate(schemaProject, req.body, next);
}
