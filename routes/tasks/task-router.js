const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/task-control");
const { validateCreateTask, validateDeleteTask } = require("./validation");

router.post(
  "/projects/:projectId/sprints/:sprintId",
  validateCreateTask,
  ctrl.addTask
);

router.delete(
  "/projects/:projectId/sprints/:sprintId",
  validateDeleteTask,
  ctrl.deleteTask
);

module.exports = router;
