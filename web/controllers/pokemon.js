//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const express = require("express")
const router = express.Router()

router.get("/teambuilder", function(req, res) {
  res.render("pages/pokemon/teambuilder")
})

module.exports = router
