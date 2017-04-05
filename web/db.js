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

const pool = MySQL.createPool({
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
})

pool.getConnection().then((connection) => {
  pool.releaseConnection(connection)
  _.forEach(models, (model) => {
    model.init(pool)
  })
}).catch((e) => {
  winston.error(stripIndents`
    Error connecting to MySQL database with credentials set in environment variables
    MYSQL_DATABASE, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD:
    ${e.stack}
  `)
  process.exit(1)
})
