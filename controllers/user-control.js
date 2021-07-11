const jwt = require('jsonwebtoken')
require('dotenv').config()
const Users = require('../model/user-model')
const Tasks = require('../model/task-model')
const { HttpCode } = require('../helpers/constants')
const Sprints = require('../model/sprint-model')
const Projects = require('../model/project-model')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const registration = async (req, res, next) => {
  const userEmail = req.body.email.toLowerCase()

  try {
    const checksUser = await Users.findByEmail(userEmail)

    if (checksUser) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'conflict',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      })
    }

    const newUser = await Users.createUser(req.body)

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET_KEY, {
      expiresIn: '24h',
    })

    await Users.updateToken(newUser?._id, token)

    const { _id, email } = await newUser

    return res.status(HttpCode.CREATED).json({
      status: 'created',
      code: HttpCode.CREATED,
      data: { token, user: { email, _id } },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.validPassword(password)

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      })
    }
    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '24h' })
    await Users.updateToken(id, token)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { token, user: { email, id } },
    })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await Users.findById(userId)
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      })
    }

    await Users.updateToken(user.id, null)
    return res.status(HttpCode.NO_CONTENT).json({})
  } catch (err) {
    next(err)
  }
}

const current = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await Users.findById(userId)
    if (user) {
      const { email } = user
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          email: user.email,
          id: user._id,
        },
      })
    } else {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      })
    }
  } catch (err) {
    next(err)
  }
}

const removeAllProjects = async (req, res, next) => {
  const { id } = req.user
  const { projectsId } = req.user

  try {
    const deleteTasks = await Tasks.removeTaskByProjectOwnerId(id)

    if (deleteTasks) {
      const deleteSprints = await Sprints.removeAllSprints(id)

      if (deleteSprints) {
        projectsId.map(async projectId => {
          const project = await Projects.getProjectById(projectId)
          if (project?.owner === id) {
            await Users.removeProjects(projectId)
          }
        })

        const deleteProjects = await Projects.removeAllProjects(id)

        if (deleteProjects.deletedCount !== 0) {
          return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            message: `${deleteProjects.deletedCount} project(s) were deleted`,
          })
        }
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          status: 'fail',
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'projects were not deleted',
        })
      }
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'fail',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'projects, sprints were not deleted',
      })
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: 'projects, sprints and tasks were not deleted',
    })
  } catch (err) {
    next(err.message)
  }
}

const removeAllSprints = async (req, res, next) => {
  const { id } = req.user
  const { projectId } = req.params

  try {
    const sprints = await Sprints.getAllSprints(projectId)

    if (Object.keys(sprints).length !== 0) {
      sprints.map(async sprint => {
        const isOwner = sprint.projectOwnerId.toString() === id

        if (isOwner) {
          return await Sprints.removeSprintAndTasks(sprint._id)
        }
        return res.status(HttpCode.FORBIDDEN).json({
          status: 'error',
          code: HttpCode.FORBIDDEN,
          message: 'only project owner can delete sprints',
        })
      })
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'sprints and tasks were deleted',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'sprint list is empty!',
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registration,
  login,
  logout,
  current,
  removeAllProjects,
  removeAllSprints,
}
