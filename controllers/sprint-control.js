const Sprint = require("../model/sprint-model");
const Project = require("../model/project-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const addSprint = async (req, res, next) => {
  const projectId = req.params.projectId;
  const currentUser = req.user.id;
  try {
    const isOwner = await Project.isOwner(projectId, currentUser);
    console.log("isOwner", isOwner);

    if (isOwner) {
      const data = {
        ...req.body,
        projectId,
        projectOwnerId: currentUser,
      };
      const newSprint = await Sprint.createSprint(data);

      if (newSprint._id) {
        return res.status(HttpCode.CREATED).json({
          status: "Created",
          code: HttpCode.CREATED,
          data: {
            sprint: newSprint,
          },
        });
      }
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: "Error",
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: "sprint was not created",
      });
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: "only project owner can add sprint",
    });
  } catch (err) {
    next(err.message);
  }
};

const removeSprint = async (req, res, next) => {
  const currentUser = req.user.id;
  const sprintId = req.params.sprintId;

  try {
    const sprint = await Sprint.getSprintById(sprintId);

    if (sprint) {
      const isOwner = await Sprint.checkIsOwner(
        currentUser,
        sprint.projectOwnerId
      );
      if (isOwner) {
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
      }
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: "error",
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: "only project owner can delete sprint",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "not found",
      code: HttpCode.NOT_FOUND,
      message: "sprint was not found",
    });
  } catch (err) {
    next(err.message);
  }
};

const changeSprintName = async (req, res, next) => {
  const newTitle = req.body.title;
  const sprintId = req.params.sprintId;
  const currentUserId = req.user.id;

  try {
    const sprint = await Sprint.getSprintById(sprintId);

    if (sprint._id) {
      const isOwner = await Sprint.checkIsOwner(
        currentUserId,
        sprint.projectOwnerId
      );

      if (isOwner) {
        const result = await Sprint.changeName(newTitle, sprintId);
        const { _id, title, projectId } = result;

        if (_id) {
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
      }
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: "error",
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: "only project owner can change title",
      });
    }
  } catch (err) {
    next(err.message);
  }
};

const getAllSprints = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const checkedProject = await Project.getProjectById(projectId);

    if (checkedProject._id) {
      const sprints = await Sprint.getAllSprints(projectId);
      const project = await Project.getProjectById(projectId);

      if (sprints) {
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
      message: "project was not found",
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
