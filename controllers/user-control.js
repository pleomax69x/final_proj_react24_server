const Users = require("../model/user-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const registration = async (req, res, next) => {
  try {
    console.log(req.body.email);
    const checksUser = await Users.findByEmail(req.body.email);

    if (checksUser) {
      return res.status(HttpCode.CONFLICT).json({
        status: "Conflict",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const newUser = await Users.createUser(req.body);
    const { email } = newUser;

    return res.status(HttpCode.CREATED).json({
      status: "Created",
      code: HttpCode.CREATED,
      data: { user: { email } },
    });
  } catch (err) {
    next(err.message);
  }
};

const login = async (req, res, next) => {};

const logout = async (req, res, next) => {};

module.exports = {
  registration,
  login,
  logout,
};
