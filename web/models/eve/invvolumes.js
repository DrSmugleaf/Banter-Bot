//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const winston = require("winston")

module.exports = {
  db: null,

  async init(db) {
    this.db = db
    await this.db.query("SELECT * FROM invvolumes LIMIT 1").catch(() => {
      winston.error(`MySQL table invvolumes in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
    })
  },

  get(id) {
    return this.db.query("SELECT * FROM invvolumes WHERE typeID = ? LIMIT 1", [id])
  }
}
