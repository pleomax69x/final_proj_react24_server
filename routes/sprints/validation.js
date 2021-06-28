const Joi = require("joi");
const { HttpCode } = require("../../helpers/constants");

const schemaCreateSprint = Joi.object({
  title: Joi.string().required(),
  date: Joi.string().required(),
  duration: Joi.string().required(),
  projectId: Joi.string().required(),
});

const validate = async (schema, body, { projectId }, next) => {
  const data = {
    ...body,
    projectId,
  };
  try {
    await schema.validateAsync(data);

    next();
  } catch (err) {
    next({
      status: "fail",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

module.exports.validateCreateSprint = (req, _res, next) => {
  return validate(schemaCreateSprint, req.body, req.params, next);
};
