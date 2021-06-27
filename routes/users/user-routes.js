const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user-control");
const guard = require("../../helpers/guard");
const { validateUser } = require("./validation");

router.post("/registration", validateUser, ctrl.registration);
// router.post("/login", validateUser, ctrl.login);
// router.post("/logout", guard, ctrl.logout);

module.exports = router;
