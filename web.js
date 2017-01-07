//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const DB = require("./libs/util/db")
const db = new DB()
const express = require("express")
const logger = require("morgan")
const winston = require("winston")

const app = express()
app.set("port", (process.env.PORT || 5000))
app.use(logger("dev"))
app.use(express.static(__dirname + "/web/public"))

app.set("views", __dirname + "/web/views")
app.set("view engine", "ejs")

app.use(function(req, res, next) {
  winston.info("/" + req.method)
  next()
})

app.get("/", function(req, res) {
  res.render("pages/index")
})

app.get("/quotes", function(req, res) {
  db.query("SELECT * FROM quotes")
    .then(data => {
      res.render("pages/quotes", { results: data })
    })
    .catch(e => {
      winston.error(e)
      res.send("Error")
    })
})

app.use("*", function(req, res) {
  res.render("pages/404")
})

app.listen(process.env.PORT || 3000, function() {
  winston.info(`Live at ${app.get("port")}`)
})
