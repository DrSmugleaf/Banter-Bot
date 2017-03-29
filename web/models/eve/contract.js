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
      destination TINYTEXT NOT NULL,
      value BIGINT UNSIGNED NOT NULL,
      value_formatted TINYTEXT NOT NULL,
      value_short TINYTEXT NOT NULL,
      quote BIGINT UNSIGNED NOT NULL,
      quote_formatted TINYTEXT NOT NULL,
      quote_short TINYTEXT NOT NULL,
      volume BIGINT UNSIGNED NOT NULL,
      volume_formatted TINYTEXT NOT NULL,
      value_volume_ratio INTEGER UNSIGNED NOT NULL,
      value_volume_ratio_formatted TINYTEXT NOT NULL,
      multiplier TINYINT UNSIGNED NOT NULL,
      submitter_id INTEGER UNSIGNED NOT NULL,
      submitter_name TINYTEXT NOT NULL,
      submitted BIGINT NOT NULL,
      submitted_formatted TINYTEXT NOT NULL,
      status TINYTEXT NOT NULL,
      freighter_id INTEGER UNSIGNED,
      freighter_name TINYTEXT,
      taxed BOOLEAN NOT NULL DEFAULT 0
    )`)
  },

  delete(id) {
    return this.db.query("DELETE FROM eve_contracts WHERE id=?", [id])
  },

  get(id) {
    return this.db.query("SELECT * FROM eve_contracts WHERE id=? LIMIT 1", [id])
  },
  
  getAllPending() {
    return this.db.query("SELECT * FROM eve_contracts WHERE status = 'pending' OR status = 'flagged'")
  },
  
  getAllOngoing() {
    return this.db.query("SELECT * FROM eve_contracts WHERE status = 'ongoing'")
  },
  
  getAllFinalized() {
    return this.db.query("SELECT * FROM eve_contracts WHERE status = 'completed'")
  },

  set(data) {
    return this.db.query("INSERT INTO eve_contracts SET ? ON DUPLICATE KEY UPDATE ?", [data, data])
  }
}
