//
// Copyright (c) 2017 DrSmugleaf
//

require("checkenv").check()
if(process.env.NODE_ENV === "dev") require("longjohn")
require("./db")
const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const path = require("path")
const winston = require("winston")

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

// if(process.env.NODE_ENV === "dev") {
//   app.use(function(e, req, res) {
//     winston.info(e)
//     res.status(e.status || 500)
//     res.render("pages/404", {
//       message: e.message,
//       error: e
//     })
//   })
// } else {
//   app.use(function(e, req, res) {
//     winston.info(e)
//     res.status(e.status || 500)
//     res.render("pages/404", {
//       message: e.message,
//       error: {}
//     })
//   })
// }

app.listen(process.env.PORT || 3000, function() {
  winston.info(`Listening on port ${process.env.PORT || 3000}`)
})
