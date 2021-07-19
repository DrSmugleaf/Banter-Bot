//
// Copyright (c) 2017 DrSmugleaf
//

require("dotenv").config()
require("checkenv").check()
if(process.env.NODE_ENV === "dev") require("longjohn")

const winston = require("winston")
const { transports } = require("winston")
winston.add(new transports.Console({
  format: winston.format.simple()
}))

require("./db")
const express = require("express")
const app = express()
const helmet = require("helmet")
const path = require("path")

app.use(helmet({
  contentSecurityPolicy: {
    reportOnly: true
  }
}))
app.set("trust proxy", 1)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require("morgan")("dev"))
app.engine("pug", require("pug").__express)
app.set("views", path.join(__dirname + "/views"))
app.set("view engine", "pug")
app.use(express.static(path.join(__dirname + "/public")))
app.use(require("./controllers"))
app.locals.character = {}

if(process.env.NODE_ENV !== "dev") {
  app.use("*", function(e, req, res, next) {
    winston.info(e.stack)
    res.status(500).render("pages/500")
    next()
  })
}

module.exports = app