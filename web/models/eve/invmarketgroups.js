//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const async = require("async")
const winston = require("winston")

module.exports = {
  db: null,
  tableName: null,

  async init(db) {
    this.db = db
    const tables = await this.db.query("SELECT table_name FROM information_schema.tables WHERE LOWER(table_name) LIKE 'invmarketgroups' AND table_schema = ?", [process.env.MYSQL_DATABASE])
    if(!tables[0]) {
      winston.error(`MySQL table invMarketGroups in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
    }
    this.tableName = tables[0].table_name
    
    return this.db.query("CREATE TABLE IF NOT EXISTS eve_banned_market_groups LIKE ??", [this.tableName])
  },
  
  allow(id) {
    return this.db.query("DELETE FROM eve_banned_market_groups WHERE marketGroupID = ?", [id])
  },
  
  ban(data) {
    return this.db.query("INSERT INTO eve_banned_market_groups SET ?", [data])
  },
  
  get(id) {
    return this.db.query("SELECT * FROM ?? WHERE marketGroupID = ? LIMIT 1", [this.tableName, id])
  },
  
  getBanned() {
    return this.db.query("SELECT * FROM eve_banned_market_groups")
  },
  
  getByName(name) {
    return this.db.query("SELECT * FROM ?? WHERE marketGroupName = ?", [this.tableName, name])
  },
  
  getAllParentsByID(parentGroupID) {
    const that = this
    const parents = [parentGroupID]
    return new Promise((resolve, reject) => {
      async.whilst(
        function() { return Boolean(parentGroupID) },
        async function() {
          const result = await that.db.query("SELECT * FROM ?? WHERE marketGroupID = ? LIMIT 1", [that.tableName, parentGroupID])
          parentGroupID = result[0].parentGroupID
          if(parentGroupID) parents.push(parentGroupID)
          return parents
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
  },

  getHighestParentID(id) {
    const that = this
    return new Promise((resolve, reject) => {
      this.db.query("SELECT * FROM ?? WHERE marketGroupID = ? LIMIT 1", [this.tableName, id]).then((result) => {
        var parent = result[0].parentGroupID
        async.whilst(
          function() { return parent },
          async function(callback) {
            result = await that.db.query("SELECT * FROM ?? WHERE marketGroupID = ? LIMIT 1", [this.tableName, parent])
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
  
  isBanned(id) {
    return this.db.query("SELECT * FROM eve_banned_market_groups WHERE marketGroupID = ? LIMIT 1", [id])
  }
}
