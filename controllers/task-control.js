const Task = require("../model/task-model");
const Sprint = require("../model/sprint-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const addTask = async (req, res, next) => {
  const sprintId = req.params.sprintId;
  try {
    const checkSprint = await Sprint.getSprintById(sprintId);

    if (checkSprint) {
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
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: "sprint does not exist",
    });
  } catch (err) {
    next(err.message);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.removeTask(taskId);

    if (deletedTask) {
      const { _id, title, sprintId } = deletedTask;
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
    const tasks = await Task.getAllTaskBySprintId(sprintId);
    const sprint = await Sprint.getSprintById(sprintId);

    if (sprint) {
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
      message: "sprint not found",
    });
  } catch (err) {
    next(err);
  }
};

const changeTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  try {
    const changedTask = await Task.changeTaskById(req.body, taskId);
    if (changedTask) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "task was changed",
        data: changedTask,
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "not found",
      code: HttpCode.NOT_FOUND,
      message: "task was not change",
    });
  } catch (err) {
    next(err.message);
  }
};

module.exports = {
  addTask,
  deleteTask,
  getAllTasks,
  changeTask,
};
