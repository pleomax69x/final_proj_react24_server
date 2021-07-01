const Sprint = require("../model/sprint-model");
const Project = require("../model/project-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const addSprint = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const checkProject = await Project.getProjectById(projectId);

    if (checkProject) {
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
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: "project does not exist",
    });
  } catch (err) {
    next(err.message);
  }
};

const removeSprint = async (req, res, next) => {
  const sprintId = req.body.id;
  try {
    const removedSprint = await Sprint.removeSprintAndTasks(sprintId);
    if (removedSprint) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "sprint was deleted",
        data: {
          sprint: removedSprint,
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
    const checkProject = await Project.getProjectById(projectId);

    if (checkProject) {
      const sprints = await Sprint.getAllSprints(projectId);
      const project = await Project.getProjectById(projectId);

      if (project) {
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          data: {
            project,
            sprints,
          },
        });
      }
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: "not found",
      code: HttpCode.NOT_FOUND,
      message: "project not found",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addSprint,
  removeSprint,
  changeSprintName,
  getAllSprints,
};
