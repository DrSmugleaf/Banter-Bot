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
    const tables = await this.db.query("SELECT table_name FROM information_schema.tables WHERE LOWER(table_name) LIKE 'invtypes' AND table_schema = ?", [process.env.MYSQL_DATABASE])
    if(!tables[0]) {
      winston.error(`MySQL table invTypes in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
    }
    this.tableName = tables[0].table_name
    
    return this.db.query("CREATE TABLE IF NOT EXISTS eve_banned_types LIKE ??", [this.tableName])
  },
  
  allow(id) {
    return this.db.query("DELETE FROM eve_banned_types WHERE typeID = ?", [id])
  },
  
  ban(data) {
    return this.db.query("INSERT INTO eve_banned_types SET ?", [data])
  },

  get(id) {
    return this.db.query("SELECT * FROM ?? WHERE typeID = ? LIMIT 1", [this.tableName, id])
  },
  
  getBanned() {
    return this.db.query("SELECT * FROM eve_banned_types")
  },
  
  getByName(name) {
    return this.db.query("SELECT * FROM ?? WHERE typeName = ?", [this.tableName, name])
  },
  
  isIDBanned(id) {
    return this.db.query("SELECT * FROM eve_banned_types WHERE typeID = ? LIMIT 1", [id])
  },
  
  isNameBanned(name) {
    return this.db.query("SELECT * FROM eve_banned_types WHERE typeName = ?", [name])
  }
}
