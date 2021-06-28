const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/project-control')
const guard = require('../../helpers/guard')
const { validateProject, validateProjectName } = require('./validation')

router.post('/', validateProject, ctrl.create)
router.get('/', ctrl.getAll)
router.delete('/:projectId', ctrl.remove)
router.patch('/:projectId/name', validateProjectName, ctrl.patch)

module.exports = router
