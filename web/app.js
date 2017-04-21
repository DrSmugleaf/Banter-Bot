//
// Copyright (c) 2017 DrSmugleaf
//

require("checkenv").check()
if(process.env.NODE_ENV === "dev") require("longjohn")
require("./db")
const bodyParser = require("body-parser")
const fs = require("fs")
const express = require("express")
const app = express()
const helmet = require("helmet")
const https = require("https")
const path = require("path")
const winston = require("winston")
const credentials = {
  cert: fs.readFileSync(process.env.SSL_CERT, "utf8"),
  key: fs.readFileSync(process.env.SSL_KEY, "utf8")
}

app.use(helmet())
app.set("trust proxy", 1)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require("morgan")("dev"))
app.engine("jade", require("jade").__express)
app.set("views", path.join(__dirname + "/views"))
app.set("view engine", "jade")
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

https.createServer(credentials, app).listen(process.env.PORT)
winston.info(`Listening on port ${process.env.PORT}`)
