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

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    await Users.updateToken(user.id, null);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registration,
  login,
  logout,
};
