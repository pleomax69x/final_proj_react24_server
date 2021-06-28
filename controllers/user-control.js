const Users = require("../model/user-model");

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

const { HttpCode } = require("../helpers/constants");

const registration = async (req, res, next) => {
  try {
    const checksUser = await Users.findByEmail(req.body.email);

    if (checksUser) {
      return res.status(HttpCode.CONFLICT).json({
        status: "Conflict",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }

    const newUser = await Users.createUser(req.body);

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    await Users.updateToken(newUser?._id, token);

    const { _id, email } = await newUser;

    return res.status(HttpCode.CREATED).json({
      status: "Created",
      code: HttpCode.CREATED,
      data: { token, user: { email, _id } },
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
