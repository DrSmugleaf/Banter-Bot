//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = {
  db: null,
  
  async init(db) {
    this.db = db
    await this.db.query(`CREATE TABLE IF NOT EXISTS eve_destinations (
      name VARCHAR(32) NOT NULL PRIMARY KEY,
      image TINYTEXT NOT NULL
    )`)
  },
  
  add(data) {
    return this.db.query("INSERT INTO eve_destinations SET ?", [data])
  },
  
  get(name) {
    return this.db.query("SELECT * FROM eve_destinations WHERE name = ? LIMIT 1", [name])
  },
  
  getAll() {
    return this.db.query("SELECT * FROM eve_destinations")
  },
  
  remove(name) {
    return this.db.query("DELETE FROM eve_destinations WHERE name = ?", [name])
  }
}