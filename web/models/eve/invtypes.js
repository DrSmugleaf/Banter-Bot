//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const async = require("async")
const winston = require("winston")

module.exports = {
  db: null,

  async init(db) {
    this.db = db
    await this.db.query("SELECT * FROM invtypes LIMIT 1").catch((e) => {
      winston.error(`MySQL table invtypes in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
    })
  },

  get(id) {
    return this.db.query("SELECT * FROM invtypes WHERE typeID = ? LIMIT 1", [id])
  },
}
