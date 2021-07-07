const Projects = require('../model/project-model')
const Users = require('../model/user-model')
const { HttpCode } = require('../helpers/constants')
const Sprints = require('../model/sprint-model')

const create = async (req, res, next) => {
  const userId = req.user.id
  const body = req.body
  const email = req.user.email
  try {
    const project = await Projects.createProject({
      ...body,
      owner: userId,
      teammates: [
        {
          email,
          id: userId,
        },
      ],
    })

    if (project) {
      const addProject = await Users.addProjectToUser(userId, project.id)

      if (addProject) {
        return res.status(HttpCode.CREATED).json({
          status: 'created',
          code: HttpCode.CREATED,
          data: { project },
        })
      }
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'fail',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'project was not added to user',
      })
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: 'project was not created',
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = HttpCode.BAD_REQUEST
    }
    next(err)
  }
}

const getAll = async (req, res, next) => {
  const projectsId = req.user.projectsId
  try {
    const { projects, total, limit, page } = await Projects.getAllProjects(
      projectsId,
      req.query,
    )

    if (projects) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { total, limit, page, projects },
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'projects list is empty',
    })
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  const userId = req.user.id
  const projectId = req.params.projectId
  try {
    const project = await Projects.getProjectById(projectId)

    if (project) {
      const isOwner = await Projects.isOwner(projectId, userId)

      if (isOwner) {
        const projectSprints = await Sprints.getAllSprints(projectId)

        if (projectSprints) {
          projectSprints.map(async sprint => {
            return await Sprints.removeSprintAndTasks(sprint._id)
          })
        }

        const teammatesId = project.teammates.map(el => el.id)
        const removeUsers = await Users.removeProjectFromAllUsers(
          teammatesId,
          projectId,
        )

        if (removeUsers) {
          const removeProject = await Projects.removeProject(userId, projectId)

          if (removeProject) {
            return res.status(HttpCode.OK).json({
              status: 'success',
              code: HttpCode.OK,
              message: 'project was deleted',
            })
          }
          return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
            status: 'fail',
            code: HttpCode.INTERNAL_SERVER_ERROR,
            message: 'project was not deleted',
          })
        }
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          status: 'fail',
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'users are not deleted from project',
        })
      }
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.FORBIDDEN,
        message: 'only owner can delete the project',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'project was not found',
    })
  } catch (err) {
    next(err)
  }
}

const patch = async (req, res, next) => {
  const userId = req.user.id
  const projectId = req.params.projectId
  const body = req.body
  try {
    const project = await Projects.getProjectById(projectId)

    if (project) {
      const isOwner = await Projects.isOwner(projectId, userId)

      if (isOwner) {
        const changedProjectName = await Projects.updateProjectName(
          userId,
          projectId,
          body,
        )
        if (changedProjectName) {
          return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            data: { project: changedProjectName },
          })
        }
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          status: 'fail',
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'project name was not changed',
        })
      }
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.FORBIDDEN,
        message: 'only owner can change the project name',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'project was not found',
    })
  } catch (err) {
    next(err)
  }
}

const checkAccess = async (req, res, next) => {
  const user = req.user
  const projectId = req.params.projectId
  try {
    const project = await Projects.getProjectById(projectId)

    if (project) {
      const isTeammate = await Projects.isTeammate(user, projectId)

      if (isTeammate) {
        const sprints = await Sprint.getAllSprints(projectId)

        if (sprints) {
          return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            data: {
              project,
              sprints: sprints,
            },
          })
        }
        return res.status(HttpCode.NOT_FOUND).json({
          status: 'error',
          code: HttpCode.NOT_FOUND,
          message: 'sprints list is empty',
        })
      }
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.FORBIDDEN,
        message: 'forbidden, not a teammate',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'project not found',
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
}
