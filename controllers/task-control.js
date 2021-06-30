const Task = require("../model/task-model");
const Sprint = require("../model/sprint-model");

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
          task: {
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
    const { _id, title, sprintId } = deletedTask;

    if (deletedTask) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "task was deleted",
        data: {
          task: {
            id: _id,
            title,
            sprintId,
          },
        },
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

const getAllTasks = async (req, res, next) => {
  const sprintId = req.params.sprintId;

  try {
    if (sprintId) {
      const tasks = await Task.getAllTaskBySprintId(sprintId);
      const sprint = await Sprint.getSprintById(sprintId);

      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          sprint,
          tasks,
        },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "not found",
      code: HttpCode.NOT_FOUND,
      message: "not found",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addTask,
  deleteTask,
  getAllTasks,
};
