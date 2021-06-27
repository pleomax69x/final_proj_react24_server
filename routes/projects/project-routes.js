const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/project-control')
const guard = require('../../helpers/guard')
const { validateProject } = require('./validation')

router.post('/projects', validateProject, ctrl.create)

module.exports = router
