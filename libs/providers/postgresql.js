//
// Copyright (c) 2016-2017 DrSmugleaf
//

// https://github.com/Gawdl3y/discord.js-commando/blob/master/src/providers/sqlite.js
"use strict"
const DB = require("../util/db")

class PostgreSQLProvider extends DB {
  constructor() {
    super()

    this.init()
  }

  init() {
    this.run("CREATE TABLE IF NOT EXISTS users (id BIGINT PRIMARY KEY, settings TEXT)")
  }

  run(query) {
    if(query === "CREATE TABLE IF NOT EXISTS settings (guild INTEGER PRIMARY KEY, settings TEXT)") {
      query = "CREATE TABLE IF NOT EXISTS settings (guild BIGINT PRIMARY KEY, settings TEXT)"
    }
    return this.pgp.any(query)
  }

  all(query) {
    return this.pgp.any(query)
  }

  prepare(query) {
    const that = this
    switch (query) {
    case "INSERT OR REPLACE INTO settings VALUES(?, ?)":
      query = "INSERT INTO settings (guild, settings) VALUES ($1, $2) ON CONFLICT (guild) DO UPDATE SET guild = $1, settings = $2"
      break
    case "DELETE FROM settings WHERE guild = ?":
      query = "DELETE FROM settings WHERE guild = $1"
      break
    default:
      break
    }

    return {
      run: function(...args) {
        that.pgp.any(query, args)
      },
      finalize: function() {
        query = null
      }
    }
  }
}

module.exports = PostgreSQLProvider
