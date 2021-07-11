const User = require('../model/user-model')
const Project = require('../model/project-model')
const { HttpCode } = require('../helpers/constants')

const addTeammate = async (req, res, next) => {
  const projectId = req.params.projectId
  const userEmail = req.body.email.toLowerCase()

  try {
    const user = await User.findByEmail(userEmail)

    if (user) {
      const checkTeammateList = await Project.isTeammate(user, projectId)

      if (!checkTeammateList) {
        const { projectsId } = user

        const checkProjectsList = projectsId.find(el => {
          return el === projectId
        })

        if (!checkProjectsList) {
          await User.addProjectToUser(user._id, projectId)
        }

        const { teammates } = await Project.addTeammateToProject(
          user,
          projectId,
        )

        return res.status(HttpCode.CREATED).json({
          status: 'created',
          code: HttpCode.CREATED,
          message: `user ${user.email} was added`,
          data: {
            user: {
              id: user._id,
              email: user.email,
            },
            teammates,
          },
        })
      }
      return res.status(HttpCode.CONFLICT).json({
        status: 'conflict',
        code: HttpCode.CONFLICT,
        message: 'user already in project',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'user was not found',
    })
  } catch (err) {
    next(err.message)
  }
}

const removeTeammate = async (req, res, next) => {
  const { projectId, userId } = req.params

  try {
    const teammate = await User.findById(userId)

    if (teammate._id) {
      console.log('remove project from user')
      await User.removeProjectFromUser(teammate._id, projectId)
    }

    const isTeammate = await Project.isTeammate(teammate, projectId)

    if (isTeammate) {
      const { teammates } = await Project.removeTeammate(projectId, teammate)

      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: `teammate "${teammate.email}" was delete`,
        data: teammates,
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'not found',
      code: HttpCode.NOT_FOUND,
      message: `teammate "${teammate.email}" was not found`,
    })
  } catch (err) {
    next(err.message)
  }
}

module.exports = {
  addTeammate,
  removeTeammate,
}
