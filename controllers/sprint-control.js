const Sprint = require("../model/sprint-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const addSprint = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const newSprint = await Sprint.createSprint(req.body, projectId);
    const { _id, title, date, duration } = newSprint;

    if (_id) {
      return res.status(HttpCode.CREATED).json({
        status: "Created",
        code: HttpCode.CREATED,
        data: {
          sprint: {
            id: _id,
            title,
            date,
            duration,
            projectId,
          },
        },
      });
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: newSprint,
    });
  } catch (err) {
    next(err.message);
  }
};

module.exports = {
  addSprint,
};
