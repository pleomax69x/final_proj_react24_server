const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/teammate-control')
const guard = require('../../helpers/guard')
const { validateDelTeammate, validateAddTeammate } = require('./validation')

router.post('/:projectId', guard, validateAddTeammate, ctrl.addTeammate)
router.delete('/:projectId/:userId', guard, ctrl.removeTeammate)

module.exports = router
