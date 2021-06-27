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

module.exports = {
    create,
}