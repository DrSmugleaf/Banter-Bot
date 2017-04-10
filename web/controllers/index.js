//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const express = require("express")
const router = express.Router()

router.use("/", require("./eve"))

router.get("*", function(req, res) {
  res.render("pages/404")
})

module.exports = router
