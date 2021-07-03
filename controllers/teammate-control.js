const Project = require("../model/project-model");
const Teammate = require("../model/teammate-model");

const { HttpCode } = require("../helpers/constants");
require("dotenv").config();

const addTeammate = async (req, res, next) => {};
const getAllTeammates = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const checkProject = await Project.getProjectById(projectId);

    if (checkProject) {
      const teammates = await Teammate.getAllTeammate(projectId);
      const project = await Project.getProjectById(projectId);

      if (project) {
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          data: {
            project,
            teammates,
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

const removeTeammate = async (req, res, next) => {};

module.exports = {
  addTeammate,
  getAllTeammates,
  removeTeammate,
};
