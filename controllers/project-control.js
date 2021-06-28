const Projects = require('../model/project-model')
const { HttpCode } = require('../helpers/constants')

const create = async (req, res, next) => {
  const userId = req.user.id
  const body = req.body
  try {
    const project = await Projects.createProject({ ...body, owner: userId })
    return res.status(HttpCode.CREATED).json({
      status: 'created',
      code: HttpCode.CREATED,
      data: { project },
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = HttpCode.BAD_REQUEST
    }
    next(error)
  }
}

const getAll = async (req, res, next) => {
  const userId = req.user.id
  try {
    const { projects, total, limit, page } = await Projects.getProjects(
      userId,
      req.query,
    )
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { total, limit, page, projects },
    })
  } catch (error) {
    next(error)
  }
}
  
const remove = async (req, res, next) => {
  const userId = req.user.id
  const projectId = req.params.projectId
  try {
    const owner = await Projects.isOwner(userId)
    if (owner) {
      const project = await Projects.removeProject(userId, projectId)
      if (project) {
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          message: 'Project was deleted',
        })
      }
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not Found',
      })
    }
    return res
      .status(HttpCode.FORBIDDEN)
      .json({ status: 'error', code: HttpCode.FORBIDDEN, message: 'Forbidden' })
  } catch (error) {
    next(error)
  }
}

const patch = async (req, res, next) => {
  const userId = req.user.id
  const projectId = req.params.projectId
  const body = req.body
  try {
    const owner = await Projects.isOwner(userId)
    if (owner) {
      const project = await Projects.updateProjectName(userId, projectId, body)
      if (project) {
        return res
          .status(HttpCode.OK)
          .json({ status: 'success', code: HttpCode.OK, data: { project } })
      }
      return res
        .status(HttpCode.NOT_FOUND)
        .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not Found' })
    }
    return res
        .status(HttpCode.FORBIDDEN)
        .json({ status: 'error', code: HttpCode.FORBIDDEN, message: 'Forbidden' })
    } catch (error) {
      next(error)
    }
}

module.exports = {
  create,
  getAll,
  remove,
  patch,
}