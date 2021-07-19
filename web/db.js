//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const path = require("path")
const models = require("require-all")({
  dirname: path.join(__dirname, "/models/eve")
})
const winston = require("winston")
const yargs = require("yargs")
const { Sequelize } = require("sequelize")

const argv = yargs
  .command("import", "Whether or not to import EVE yaml files into the database")
  .argv

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  pool: {
    max: parseInt(process.env.MYSQL_CONNECTION_LIMIT, 10)
  },
  dialect: "mysql"
})

sequelize.authenticate().then(() => {
  winston.info("Database connection established.")
  sequelize.sync()

  const doImport = true || argv._.includes("import") // TODO

  _.forEach(models, async model => {
    model.init(sequelize)

    if (doImport && model.import !== undefined) { // TODO
      // await model.import(sequelize)
    }
  })
}).catch(e => {
  winston.error(e)
  process.exit(1)
})

module.exports = sequelize