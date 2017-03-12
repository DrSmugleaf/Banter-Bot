//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = {
  db: null,

  init(db) {
    this.db = db
    return this.db.query("CREATE TABLE IF NOT EXISTS eve_characters (id INTEGER UNSIGNED NOT NULL PRIMARY KEY, token TINYTEXT NOT NULL, character_name TINYTEXT NOT NULL, character_portrait TINYTEXT NOT NULL, character_birthday TIMESTAMP NOT NULL, corporation_id INTEGER UNSIGNED NOT NULL, corporation_name TINYTEXT NOT NULL, corporation_portrait TINYTEXT NOT NULL, alliance_id INTEGER UNSIGNED NOT NULL, alliance_name TINYTEXT NOT NULL, alliance_portrait TINYTEXT NOT NULL)")
  },

  delete(id) {
    return this.db.query("DELETE FROM eve_characters WHERE id=?", [id])
  },

  get(id) {
    return this.db.query("SELECT * FROM eve_characters WHERE id=?", [id])
  },

  async set(data) {
    return this.db.query("INSERT INTO eve_characters SET ?", data)
  }
}
