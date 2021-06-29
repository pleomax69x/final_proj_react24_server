const Joi = require("joi");
const { HttpCode } = require("../../helpers/constants");

const schemaUser = Joi.object({
  email: Joi.string()
    .min(5)
    .max(30)
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required(),
  password: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .regex(/[A-Z]\w+/)
    .required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      code: HttpCode.BAD_REQUEST,
      message: err.message
    });
  }
};

module.exports.validateUser = (req, _res, next) => {
  return validate(schemaUser, req.body, next);
};
