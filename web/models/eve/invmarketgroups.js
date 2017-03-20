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
    await this.db.query("SELECT * FROM invmarketgroups LIMIT 1").catch((e) => {
      winston.error(`MySQL table invmarketgroups in database ${process.env.MYSQL_DATABASE} doesn't exist. Please import it from CCP's latest database dump.`)
      process.exit(1)
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
