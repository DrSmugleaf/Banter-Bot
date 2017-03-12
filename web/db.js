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
})
