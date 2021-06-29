const Joi = require("joi");
const { HttpCode } = require("../../helpers/constants");

const schemaCreateSprint = Joi.object({
  title: Joi.string().required(),
  date: Joi.string().required(),
  duration: Joi.number().required(),
  projectId: Joi.string().required(),
});

const schemaRemoveSprint = Joi.object({
  id: Joi.string().required(),
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

const validateDel = async (schema, { id }, next) => {
  try {
    await schema.validateAsync(id);
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

module.exports.validateRemoveSptint = (req, _res, next) => {
  return validateDel(schemaRemoveSprint, req.body.id, next);
};
