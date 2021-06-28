const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/project-control')
const guard = require('../../helpers/guard')
const { validateProject, validateProjectName } = require('./validation')

router.post('/', guard, validateProject, ctrl.create)
router.get('/', guard, ctrl.getAll)
router.delete('/:projectId', guard, ctrl.remove)
router.patch('/:projectId/name', guard, validateProjectName, ctrl.patch)

module.exports = router
