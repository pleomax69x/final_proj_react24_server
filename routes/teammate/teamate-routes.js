const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/teammate-control");
const guard = require("../../helpers/guard");
const { validateDelTeammate, validateAddTeammate } = require("./validation");

// router.get("/:projectId", guard, ctrl.getAllTeammates);
router.post("/:projectId", guard, validateAddTeammate, ctrl.addTeammate);
// router.delete("/:teammateId", guard, validateDelTeammate, ctrl.removeTeammate);
