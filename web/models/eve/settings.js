//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = {
  db: null,
  
  async init(db) {
    this.db = db
    await this.db.query(`CREATE TABLE IF NOT EXISTS settings (
      maxVolume BIGINT NOT NULL DEFAULT 300000
    )`)
    const rows = await this.db.query("SELECT COUNT(1) FROM settings")
    if(rows[0]["COUNT(1)"] === 0) return this.db.query("INSERT INTO settings VALUES ()")
    return
  },
  
  get() {
    return this.db.query("SELECT * FROM settings")
  },
  
  set(data) {
    return this.db.query("UPDATE settings SET ?", [data])
  }
}