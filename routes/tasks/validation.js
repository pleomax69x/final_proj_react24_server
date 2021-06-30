const Joi = require("joi");
const { HttpCode } = require("../../helpers/constants");

const schemaCreateTask = Joi.object({
  title: Joi.string().required(),
  scheduledHours: Joi.number().required(),
  sprintId: Joi.string().required(),
});

const schemaDeleteTask = Joi.object({
  id: Joi.string().required(),
});

const schemaGetAllTasks = Joi.object({
  spritnId: Joi.string().required(),
});

const validate = async (schema, body, { sprintId }, next) => {
  const data = {
    ...body,
    sprintId,
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

const validateDel = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);

    next();
  } catch (err) {
    next({
      status: "fail",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

const validateGetTask = async (schema, { sprintId }, next) => {
  try {
    await schema.validateAsync(sprintId);
    next();
  } catch (err) {
    next({
      status: "fail",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

module.exports.validateCreateTask = (req, _res, next) => {
  return validate(schemaCreateTask, req.body, req.params, next);
};

module.exports.validateDeleteTask = (req, _res, next) => {
  return validateDel(schemaDeleteTask, req.body, next);
};

module.exports.validateGetTasks = (req, _res, next) => {
  return validateGetTask(schemaGetAllTasks, req.params.sprintId, next);
};
