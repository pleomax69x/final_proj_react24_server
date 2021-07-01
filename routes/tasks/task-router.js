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
  "/:sprintId",
  guard,
  validateCreateTask,
  ctrl.addTask
);

router.delete(
  "/:taskId",
  guard,
  validateDeleteTask,
  ctrl.deleteTask
);

router.get(
  "/:sprintId",
  guard,
  validateGetTasks,
  ctrl.getAllTasks
);

router.patch(
  "/:taskId",
  validateChangeTask,
  ctrl.changeTask
);

module.exports = router;
