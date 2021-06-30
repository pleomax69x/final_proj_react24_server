const Sprint = require("../model/sprint-model");
const Tasks = require("../model/task-model");
const Project = require("../model/project-model");

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

const changeSprintName = async (req, res, next) => {
  const newTitle = req.body.title;
  const sprintId = req.params.sprintId;

  try {
    if (newTitle) {
      const result = await Sprint.changeName(newTitle, sprintId);
      const { _id, title, projectId } = result;
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "title was change",
        data: {
          sprint: {
            id: _id,
            newTitle: title,
            projectId,
          },
        },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "not found",
      code: HttpCode.NOT_FOUND,
      message: "title was not change",
    });
  } catch (err) {
    next(err.message);
  }
};

const getAllSprints = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    if (projectId) {
      const sprints = await Sprint.getAllSprints(projectId, req.query);
      const project = await Project.getProjectById(projectId);

      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          project,
          sprints,
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
  addSprint,
  removeSptint,
  changeSprintName,
  getAllSprints,
};
