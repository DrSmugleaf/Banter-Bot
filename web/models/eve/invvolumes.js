//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const winston = require("winston")

module.exports = {
  db: null,
  tableName: null,

  async init(db) {
    this.db = db
    const tables = await this.db.query("SELECT table_name FROM information_schema.tables WHERE LOWER(table_name) LIKE 'invvolumes' AND table_schema = ?", [process.env.MYSQL_DATABASE])
    if(!tables[0]) {
      winston.error(`MySQL table invVolumes in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
    }
    this.tableName = tables[0].table_name
  },

  get(id) {
    return this.db.query("SELECT * FROM ?? WHERE typeID = ? LIMIT 1", [this.tableName, id])
  }
}
