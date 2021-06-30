const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/sprint-control");
const guard = require("../../helpers/guard");

const {
  validateCreateSprint,
  validateRemoveSptint,
  validateChangeSprintTitle,
  validateGetSprints,
  validateGetTasks,
} = require("../sprints/validation");

router.post(
  "/projects/:projectId/sprints",
  guard,
  validateCreateSprint,
  ctrl.addSprint
);

router.delete(
  "/projects/:projectId/sprints",
  guard,
  validateRemoveSptint,
  ctrl.removeSptint
);

router.patch(
  "/projects/:projectId/sprints/:sprintId",
  guard,
  validateChangeSprintTitle,
  ctrl.changeSprintName
);

router.get(
  "/projects/:projectId/sprints",
  guard,
  validateGetSprints,
  ctrl.getAllSprints
);

router.get(
  "/projects/:projectId/sprints/:sprintId",
  guard,
  validateGetTasks,
  ctrl.getAllTasks
);

module.exports = router;
