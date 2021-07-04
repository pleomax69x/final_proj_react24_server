const User = require('../model/user-model')
const Project = require('../model/project-model')
const { HttpCode } = require('../helpers/constants')

const addTeammate = async (req, res, next) => {
  const projectId = req.params.projectId
  try {
    const checkUser = await User.findByEmail(req.body.email)
    const currentProject = await Project.getProjectById(projectId)

    if (checkUser) {
      const { projectsId, _id } = checkUser
      const { teammates } = currentProject

      const checkProjectTeammateList = teammates.find(el => {
        return el.toString() === _id.toString()
      })

      if (!checkProjectTeammateList) {
        const checkUserProjectsList = projectsId.find(el => {
          return el === projectId
        })

        if (!checkUserProjectsList) {
          await User.addProjectToUser(checkUser._id, projectId)
        }

        await Project.addTeammateToProject(checkUser, projectId)

        const project = await Project.getProjectById(projectId)
        return res.status(HttpCode.CREATED).json({
          status: 'created',
          code: HttpCode.CREATED,
          message: 'user was added',
          data: {
            project,
            user: {
              email: checkUser.email,
              id: checkUser._id,
            },
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

const removeTeammate = async (req, res, next) => {}

module.exports = {
  addTeammate,
  removeTeammate,
}
