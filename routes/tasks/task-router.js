const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/task-control");
const { validateCreateTask } = require("./validation");

router.post(
  "/projects/:projectId/sprints/:sprintId",
  validateCreateTask,
  ctrl.addTask
);

module.exports = router;
