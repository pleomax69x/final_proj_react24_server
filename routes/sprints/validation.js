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

const schemaRemoveSptint = Joi.object({
  title: Joi.string().required(),
  sprintId: Joi.string().required(),
});

const schemaGetAllSprints = Joi.object({
  projectId: Joi.string().required,
});

const validateCreate = async (schema, body, { projectId }, next) => {
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

const validateChangeTitle = async (schema, { title }, { sprintId }, next) => {
  try {
    await schema.validateAsync(title, sprintId);
    next();
  } catch (err) {
    next({
      status: "fail",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

const validateGet = async (schema, { projectId }, next) => {
  try {
    await schema.validateAsync(projectId);
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
  return validateCreate(schemaCreateSprint, req.body, req.params, next);
};

module.exports.validateRemoveSptint = (req, _res, next) => {
  return validateDel(schemaRemoveSprint, req.body.id, next);
};

module.exports.validateChangeSprintTitle = (req, _res, next) => {
  return validateChangeTitle(
    schemaRemoveSptint,
    req.body.title,
    req.params.sprintId,
    next
  );
};

module.exports.validateGetSprints = (req, _res, next) => {
  return validateGet(schemaGetAllSprints, req.params.projectId, next);
};
