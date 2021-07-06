const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/user-control')
const guard = require('../../helpers/guard')
const { validateUser } = require('./validation')

router.get('/', guard, ctrl.current)
router.post('/registration', validateUser, ctrl.registration)
router.post('/login', validateUser, ctrl.login)
router.post('/logout', guard, ctrl.logout)
router.delete('/deleteProjects/', guard, ctrl.removeAllProjects)
router.delete('/deleteSprints/:projectId', guard, ctrl.removeAllSprints)

module.exports = router
