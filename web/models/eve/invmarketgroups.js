//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const async = require("async")
const winston = require("winston")

module.exports = {
  db: null,

  async init(db) {
    this.db = db
    await this.db.query("SELECT * FROM invmarketgroups LIMIT 1").catch(() => {
      winston.error(`MySQL table invmarketgroups in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
    })
    return this.db.query(`CREATE TABLE IF NOT EXISTS eve_banned_market_groups (
      marketGroupID int(11) NOT NULL PRIMARY KEY,
      marketGroupName varchar(100) DEFAULT NULL
    )`)
  },
  
  allow(id) {
    return this.db.query("DELETE FROM eve_banned_market_groups WHERE id = ?", [id])
  },
  
  ban(data) {
    return this.db.query("INSERT INTO eve_banned_market_groups (?)", [data])
  },
  
  get(id) {
    return this.db.query("SELECT * FROM invmarketgroups WHERE typeID = ? LIMIT 1", [id])
  },
  
  getBanned() {
    return this.db.query("SELECT * FROM eve_banned_market_groups")
  },
  
  getByName(name) {
    return this.db.query("SELECT * FROM invmarketgroups WHERE typeName = ?", [name])
  },

  getHighestParentID(id) {
    const that = this
    return new Promise((resolve, reject) => {
      this.db.query("SELECT * FROM invmarketgroups WHERE marketGroupID = ? LIMIT 1", [id]).then((result) => {
        var parent = result[0].parentGroupID
        async.whilst(
          function() { return parent },
          async function(callback) {
            result = await that.db.query("SELECT * FROM invmarketgroups WHERE marketGroupID = ? LIMIT 1", [parent])
            if(result) parent = result[0].parentGroupID
            callback(null, result)
          },
          function(e, result) {
            if(e) {
              winston.error(e)
              reject(e)
            }
            resolve(result)
          }
        )
      })
    })
  },
}
