//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = {
  db: null,

  async init(db) {
    this.db = db
    await this.db.query(`CREATE TABLE IF NOT EXISTS eve_characters (
      id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
      token TINYTEXT NOT NULL,
      character_name TINYTEXT NOT NULL,
      character_portrait TINYTEXT NOT NULL,
      character_birthday TIMESTAMP NOT NULL,
      corporation_id BIGINT UNSIGNED NOT NULL,
      corporation_name TINYTEXT NOT NULL,
      corporation_portrait TINYTEXT NOT NULL,
      alliance_id BIGINT UNSIGNED NOT NULL,
      alliance_name TINYTEXT NOT NULL,
      alliance_portrait TINYTEXT NOT NULL,
      freighter BOOLEAN NOT NULL DEFAULT 0,
      director BOOLEAN NOT NULL DEFAULT 0
    )`)
    return this.db.query(`CREATE TABLE IF NOT EXISTS eve_banned_characters (
      name VARCHAR(32) NOT NULL PRIMARY KEY
    )`)
  },
  
  ban(name) {
    return this.db.query("INSERT INTO eve_banned_characters SET ?", [name])
  },

  delete(id) {
    return this.db.query("DELETE FROM eve_characters WHERE id = ?", [id])
  },

  get(id) {
    return this.db.query("SELECT * FROM eve_characters WHERE id = ? LIMIT 1", [id])
  },
  
  getBanned() {
    return this.db.query("SELECT * FROM eve_banned_characters")
  },
  
  getByName(name) {
    return this.db.query("SELECT * FROM eve_characters WHERE character_name = ? LIMIT 1", [name])
  },
  
  getFreighters() {
    return this.db.query("SELECT * FROM eve_characters WHERE freighter='1'")
  },
  
  isBanned(name) {
    return this.db.query("SELECT * FROM eve_banned_characters WHERE name = ? LIMIT 1", [name])
  },

  async set(data) {
    return this.db.query("INSERT INTO eve_characters SET ? ON DUPLICATE KEY UPDATE ?", [data, data])
  },
  
  unban(name) {
    return this.db.query("DELETE FROM eve_banned_characters WHERE name = ?", [name])
  }
}
