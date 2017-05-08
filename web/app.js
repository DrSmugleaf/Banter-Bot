//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
require("checkenv").check()
require("db")
if(process.env.NODE_ENV === "dev") require("longjohn")
const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const helmet = require("helmet")
const path = require("path")
const winston = require("winston")

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require("morgan")("dev"))
app.engine("jade", require("jade").__express)
app.set("views", path.join(__dirname + "/views"))
app.set("view engine", "jade")
app.use(express.static(path.join(__dirname + "/public")))
app.use(require("./controllers"))

if(process.env.NODE_ENV !== "dev") {
  app.use("*", function(e, req, res, next) {
    winston.error(e.stack)
    res.status(500).render("pages/500")
    next()
  })
}

app.listen(process.env.PORT || 3000, function() {
  winston.info(`Listening on port ${process.env.PORT || 3000}`)
})
