const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/task-control')
const guard = require('../../helpers/guard')

const {
  validateCreateTask,
  validateDeleteTask,
  validateGetTasks,
  validateChangeTask,
  validateChangScheduledHours,
} = require('./validation')

router.post('/:sprintId', guard, validateCreateTask, ctrl.addTask)
router.delete('/:taskId', guard, validateDeleteTask, ctrl.deleteTask)
router.get('/:sprintId', guard, validateGetTasks, ctrl.getAllTasks)
router.patch('/:taskId', guard, validateChangeTask, ctrl.changeTask)
router.patch(
  '/scheduledHours/:taskId',
  guard,
  validateChangScheduledHours,
  ctrl.changeScheduledHours,
)

module.exports = router
