const Projects = require("../model/project-model")
const Users = require("../model/user-model")
const { HttpCode } = require("../helpers/constants")
const Sprints = require("../model/sprint-model")
const User = require("../model/schemas/user-schema")

const create = async (req, res, next) => {
  const userId = req.user.id
  const body = req.body
  try {
    const project = await Projects.createProject({ ...body, owner: userId })
    //const teammate = await Users.addUserToProject({userId, projectId: project.id })
    //console.log(teammate);
      return res.status(HttpCode.CREATED).json({
      status: "created",
      code: HttpCode.CREATED,
      data: { project },
      })

  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = HttpCode.BAD_REQUEST
    }
    next(err)
  }
}

const getAll = async (req, res, next) => {
  const userId = req.user.id;
  const projectsId = req.user.projectsId;
  try {
    
    const { projects, total, limit, page } = await Projects.getAllProjects(
      userId,
      projectsId,
      req.query
    );
    if (projects) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { total, limit, page, projects },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not Found",
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    const owner = await Projects.isOwner(userId);
    if (owner) {
      const projectSprints = await Sprints.getAllSprints(projectId);
      projectSprints.map(async (sprint) => {
        return await Sprints.removeSprintAndTasks(sprint._id)
      })
      
      const removeUser = await Users.removeUserFromProject(userId, projectId)
      if (removeUser) {
        console.log("User removed from project")
      }
      else {
        console.log("User are not removed")
      }

      const project = await Projects.removeProject(userId, projectId);
      if (project) {
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          message: "Project was deleted",
        });
      }
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
    }
    return res.status(HttpCode.FORBIDDEN).json({
      status: "error",
      code: HttpCode.FORBIDDEN,
      message: "Forbidden",
    });
  } catch (err) {
    next(err);
  }
};

const patch = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  const body = req.body;
  try {
    const owner = await Projects.isOwner(userId);
    if (owner) {
      const project = await Projects.updateProjectName(userId, projectId, body);
      if (project) {
        return res
          .status(HttpCode.OK)
          .json({ status: "success", code: HttpCode.OK, data: { project } });
      }
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
    }
    return res.status(HttpCode.FORBIDDEN).json({
      status: "error",
      code: HttpCode.FORBIDDEN,
      message: "Forbidden",
    });
  } catch (err) {
    next(err);
  }
};

const checkAccess = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    const project = await Projects.getProjectById(projectId)
    if (project) {
      const teammate = await Users.findByProjectsId(userId, projectId)
      if (teammate) {
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          data: { project }
        })
      }
      return res.status(HttpCode.FORBIDDEN).json({
        status: "error",
        code: HttpCode.FORBIDDEN,
        message: "Forbidden",
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not Found",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  create,
  getAll,
  remove,
  patch,
  checkAccess,
};
