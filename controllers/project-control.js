const Projects = require('../model/project-model')
const { HttpCode } = require('../helpers/constants')

const create = async (req, res, next) => {
  //const userId = req.user.id
  const body = req.body
  try {
    //const project = await Projects.createProject({ ...body, owner: userId })
    const project = await Projects.createProject({ ...body })
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
  try {
    //const userId = req.user.id
    const userId = '60d860d6285a02077c1cefcb'
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

module.exports = {
  create,
  getAll,
}