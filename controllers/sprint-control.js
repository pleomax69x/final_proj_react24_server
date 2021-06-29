const Sprint = require("../model/sprint-model");
const Tasks = require("../model/task-model");

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

const removeSptint = async (req, res, next) => {
  const sprintId = req.body.id;
  try {
    await Tasks.removeAllTasksBySprintId(sprintId);
    const removedSprint = await Sprint.removeSprint(sprintId);
    const { _id, title, projectId } = removedSprint;

    if (removedSprint) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "sprint was deleted",
        data: {
          sprint: {
            id: _id,
            title,
            projectId,
          },
        },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "not found",
      code: HttpCode.NOT_FOUND,
      message: "sprint was not deleted",
    });
  } catch (err) {
    next(err.message);
  }
};

module.exports = {
  addSprint,
  removeSptint,
};
