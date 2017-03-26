//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const MySQL = require("promise-mysql")
const path = require("path")
const models = require("require-all")({
  dirname: path.join(__dirname, "/models/eve")
})
const stripIndents = require("common-tags").stripIndents
const winston = require("winston")

module.exports = MySQL.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
}).then((connection) => {
  _.forEach(models, (model) => {
    model.init(connection)
  })
}).catch((e) => {
  winston.error(stripIndents`
    Error connecting to database ${process.env.MYSQL_DATABASE},
    with host ${process.env.MYSQL_HOST},
    at port ${process.env.MYSQL_PORT},
    as user ${process.env.MYSQL_USER},
    with password defined in the MYSQL_PASSWORD environment variable.
    
    Error message: ${e.name}: ${e.message}
    Error stack trace: ${e.stack}
  `)
  process.exit(1)
})
