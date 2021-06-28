const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/project-control')
const guard = require('../../helpers/guard')
const { validateProject } = require('./validation')

router.post('/', validateProject, ctrl.create)
router.get('/', ctrl.getAll)
router.delete('/:projectId', ctrl.remove)
// router.patch('/:projectId/name', guard, validateProjectName, ctrl.patch)

module.exports = router
