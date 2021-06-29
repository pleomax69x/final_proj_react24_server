const Task = require("../model/task-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const addTask = async (req, res, next) => {
  console.log("sprintId", req.params.sprintId);
  const sprintId = req.params.sprintId;
  try {
    const newTask = await Task.createTask(req.body, sprintId);
    const { _id, title, scheduledHours } = newTask;

    if (_id) {
      return res.status(HttpCode.CREATED).json({
        status: "Created",
        code: HttpCode.CREATED,
        data: {
          sprint: {
            id: _id,
            title,
            scheduledHours,
            sprintId,
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
  addTask,
};
