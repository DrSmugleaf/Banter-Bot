//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const express = require("express")
const router = express.Router()

router.use("/eve", require("./eve"))

router.get("/", function(req, res) {
  res.render("pages/index")
})

router.get("*", function(req, res) {
  res.render("pages/404")
})

module.exports = router
