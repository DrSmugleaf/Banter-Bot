//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = {
  db: null,

  init(db) {
    this.db = db
    return this.db.query(`CREATE TABLE IF NOT EXISTS eve_contracts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      link TINYTEXT NOT NULL,
      value BIGINT UNSIGNED NOT NULL,
      volume BIGINT UNSIGNED NOT NULL,
      multiplier TINYINT UNSIGNED NOT NULL,
      submitter_id INTEGER UNSIGNED NOT NULL,
      submitter_name TINYTEXT NOT NULL,
      submitted BIGINT NOT NULL,
      status TINYTEXT NOT NULL
    )`)
  },

  delete(id) {
    return this.db.query("DELETE FROM eve_contracts WHERE id=?", [id])
  },

  get(id) {
    return this.db.query("SELECT * FROM eve_contracts WHERE id=?", [id])
  },

  getAll() {
    return this.db.query("SELECT * FROM eve_contracts")
  },

  set(data) {
    return this.db.query("INSERT INTO eve_contracts SET ? ON DUPLICATE KEY UPDATE ?", [data, data])
  }
}
