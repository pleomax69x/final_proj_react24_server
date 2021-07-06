const jwt = require('jsonwebtoken')
require('dotenv').config()
const Users = require('../model/user-model')
const { HttpCode } = require('../helpers/constants')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const registration = async (req, res, next) => {
  const userEmail = req.body.email.toLowerCase()

  try {
    const checksUser = await Users.findByEmail(userEmail)

    console.log(checksUser)

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
        data: { email },
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

module.exports = {
  registration,
  login,
  logout,
  current,
}
