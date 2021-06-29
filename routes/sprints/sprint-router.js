const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/sprint-control");
const {
  validateCreateSprint,
  validateRemoveSptint,
  validateChangeSprintTitle,
} = require("../sprints/validation");

router.post(
  "/projects/:projectId/sprints",
  validateCreateSprint,
  ctrl.addSprint
);

router.delete(
  "/projects/:projectId/sprints",
  validateRemoveSptint,
  ctrl.removeSptint
);

router.patch(
  "/projects/:projectId/sprints/:sprintId",
  validateChangeSprintTitle,
  ctrl.changeSprintName
);

module.exports = router;
