//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = {
  db: null,
  
  init(db) {
    this.db = db
    return this.db.query(`CREATE TABLE IF NOT EXISTS allowed_alliances (
      name VARCHAR(32) NOT NULL PRIMARY KEY
    )`)
  },
  
  allow(name) {
    return this.db.query("INSERT INTO allowed_alliances VALUES(?)", [name])
  },
  
  disallow(name) {
    return this.db.query("DELETE FROM allowed_alliances WHERE name = ?", [name])
  },
  
  getAllowed() {
    return this.db.query("SELECT * FROM allowed_alliances")
  },
  
  isAllowed(name) {
    return this.db.query("SELECT * FROM allowed_alliances WHERE name = ? LIMIT 1", [name])
  }
}
