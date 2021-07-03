const Joi = require("joi");
const { HttpCode } = require("../../helpers/constants");

const schemaAddTeammate = Joi.object({
  email: Joi.string().required(),
  projectId: Joi.string().required(),
});

const schemaDelTeammate = Joi.object({
  teammeteId: Joi.string().required(),
});

const addValidate = async (
  schema,
  { body: { email }, params: { projectId } },
  next
) => {
  try {
    const data = {
      email,
      projectId,
    };
    await schema.validateAsync(data);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      code: HttpCode.BAD_REQUEST,
      message: err.message,
    });
  }
};
const delValidate = async (schema, { teammateId }, next) => {
  try {
    await schema.validateAsync(teammateId);
    next();
  } catch (err) {
    next({
      status: "fail",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

module.exports.validateAddTeammate = (req, _res, next) => {
  return addValidate(schemaAddTeammate, req, next);
};

module.exports.validateDelTeammate = (req, _res, next) => {
  return delValidate(schemaDelTeammate, req.params.teammateId, next);
};
