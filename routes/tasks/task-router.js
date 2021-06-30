const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/task-control");
const guard = require("../../helpers/guard");

const { validateCreateTask, validateDeleteTask } = require("./validation");

router.post(
  "/projects/:projectId/sprints/:sprintId",
  guard,
  validateCreateTask,
  ctrl.addTask
);

router.delete(
  "/projects/:projectId/sprints/:sprintId",
  guard,
  validateDeleteTask,
  ctrl.deleteTask
);

module.exports = router;
