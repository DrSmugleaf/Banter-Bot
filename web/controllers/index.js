//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const express = require("express")
const router = express.Router()

router.use("/pokemon", require("./pokemon"))

router.get("/", function(req, res) {
  res.render("pages/index")
})

router.get("*", function(req, res) {
  res.render("pages/404")
})

module.exports = router
