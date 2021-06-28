const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/sprint-control");
const { validateCreateSprint } = require("../sprints/validation");

router.post(
  "/projects/:projectId/sprints",
  validateCreateSprint,
  ctrl.addSprint
);

module.exports = router;
