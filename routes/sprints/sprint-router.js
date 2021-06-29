const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/sprint-control");
const {
  validateCreateSprint,
  validateRemoveSptint,
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

module.exports = router;
