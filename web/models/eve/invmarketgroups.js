//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
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
    return this.db.query(`CREATE TABLE IF NOT EXISTS eve_banned_market_groups LIKE invmarketgroups`)
  },
  
  allow(id) {
    return this.db.query("DELETE FROM eve_banned_market_groups WHERE marketGroupID = ?", [id])
  },
  
  ban(data) {
    return this.db.query("INSERT INTO eve_banned_market_groups SET ?", [data])
  },
  
  get(id) {
    return this.db.query("SELECT * FROM invmarketgroups WHERE marketGroupID = ? LIMIT 1", [id])
  },
  
  getBanned() {
    return this.db.query("SELECT * FROM eve_banned_market_groups")
  },
  
  getByName(name) {
    return this.db.query("SELECT * FROM invmarketgroups WHERE marketGroupName = ?", [name])
  },
  
  getAllParentsByID(id) {
    const that = this
    return new Promise((resolve, reject) => {
      
      this.db.query("SELECT * FROM invmarketgroups WHERE marketGroupID = ? LIMIT 1", [id]).then((result) => {
        var parentGroupID = result[0].parentGroupID
        const parents = [result[0].marketGroupID]
        parents.push(parentGroupID)
        async.whilst(
          function() { return parentGroupID },
          async function(callback) {
            result = await that.db.query("SELECT * FROM invmarketgroups WHERE marketGroupID = ? LIMIT 1", [parentGroupID])
            parentGroupID = result[0].parentGroupID
            if(parentGroupID) parents.push(parentGroupID)
            callback(null, parents)
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
