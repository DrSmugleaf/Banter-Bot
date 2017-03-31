//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const winston = require("winston")

module.exports = {
  db: null,

  async init(db) {
    this.db = db
    await this.db.query("SELECT * FROM invtypes LIMIT 1").catch(() => {
      winston.error(`MySQL table invtypes in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
    })
    return this.db.query(`CREATE TABLE IF NOT EXISTS eve_banned_types LIKE invtypes`)
  },
  
  allow(id) {
    return this.db.query("DELETE FROM eve_banned_types WHERE typeID = ?", [id])
  },
  
  ban(data) {
    return this.db.query("INSERT INTO eve_banned_types SET ?", [data])
  },

  get(id) {
    return this.db.query("SELECT * FROM invtypes WHERE typeID = ? LIMIT 1", [id])
  },
  
  getBanned() {
    return this.db.query("SELECT * FROM eve_banned_types")
  },
  
  getByName(name) {
    return this.db.query("SELECT * FROM invtypes WHERE typeName = ?", [name])
  },
  
  isIDBanned(id) {
    return this.db.query("SELECT * FROM eve_banned_types WHERE typeID = ? LIMIT 1", [id])
  },
  
  isNameBanned(name) {
    return this.db.query("SELECT * FROM eve_banned_types WHERE typeName = ?", [name])
  }
}
