const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/task-control");
const guard = require("../../helpers/guard");

const {
  validateCreateTask,
  validateDeleteTask,
  validateGetTasks,
  validateChangeTask,
} = require("./validation");

router.post(
  "/projects/:projectId/sprints/:sprintId",
  guard,
  validateCreateTask,
  ctrl.addTask
);

router.delete(
  "/projects/:projectId/sprints/:sprintId/:taskId",
  guard,
  validateDeleteTask,
  ctrl.deleteTask
);

router.get(
  "/projects/:projectId/sprints/:sprintId",
  guard,
  validateGetTasks,
  ctrl.getAllTasks
);

router.patch(
  "/projects/:projectId/sprints/:sprintId/:taskId",
  validateChangeTask,
  ctrl.changeTask
);

module.exports = router;
