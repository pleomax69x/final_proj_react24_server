const Task = require("../model/task-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const addTask = async (req, res, next) => {
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

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.body.id;
    const deletedTask = await Task.removeTask(taskId);

    if (deletedTask) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "task was deleted",
        data: deletedTask,
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "task was not deleted",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addTask,
  deleteTask,
};
