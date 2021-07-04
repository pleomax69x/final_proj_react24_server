const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/sprint-control')
const guard = require('../../helpers/guard')

const {
  validateCreateSprint,
  validateRemoveSprint,
  validateChangeSprintTitle,
  validateGetSprints,
} = require('../sprints/validation')

router.post('/:projectId', guard, validateCreateSprint, ctrl.addSprint)
router.delete('/:sprintId', guard, validateRemoveSprint, ctrl.removeSprint)
router.patch(
  '/:sprintId',
  guard,
  validateChangeSprintTitle,
  ctrl.changeSprintName,
)
router.get('/:projectId', guard, validateGetSprints, ctrl.getAllSprints)

module.exports = router
