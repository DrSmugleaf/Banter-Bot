//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const DB = require("../../../util/db.js")
const winston = require("winston")

module.exports = class Quote {
  constructor(client) {
    this.client = client

    this.db = new DB()

    this.quotes = new Map()
  }

  async init() {
    await this.db.query("CREATE TABLE IF NOT EXISTS quotes (id BIGSERIAL PRIMARY KEY, text TEXT, submitter TEXT, guild BIGINT)")

    const rows = await this.db.query("SELECT id, text, submitter, CAST(guild as TEXT) as guild FROM quotes")
    for(const row of rows) {
      const guild = row.guild
      const quotes = this.quotes.get(guild) || new Array()
      quotes.push(row)
      this.quotes.set(guild, quotes)
    }
  }

  add(data) {
    return new Promise(function(resolve, reject) {
      this.db.query(
        "INSERT INTO quotes (text, submitter, guild) VALUES ($1::text, $2::text, $3::bigint)",
        [data.text, data.submitter, data.guild],
        "one"
      ).then((data) => {
        const quotes = this.quotes.get(data.guild) || new Array()
        quotes.push(data)
        this.quotes.set(data.guild, quotes)
        resolve()
      }).catch((e) => {
        winston.error(e)
        reject(e)
      })
    })
  }

  delete(data) {
    const quote = this.quotes.get(data.guild).find((quote) => {
      return quote.id === data.id
    })

    return new Promise(function(resolve, reject) {
      if(!quote) reject()
      this.db.query("DELETE FROM quotes WHERE id=$1::bigint", [quote.id], "one").then(() => {
        resolve()
      }).catch((e) => {
        winston.error(e)
        reject(e)
      })
    })
  }

  get(data) {
    const query = data.id ? "SELECT * FROM quotes WHERE id=$1::bigint AND guild=$2::bigint" :
      "SELECT * FROM quotes WHERE guild=$1::bigint OFFSET random() * (SELECT count(*)-1 FROM quotes) LIMIT 1"
    const values = data.id ? [data.id, data.guild] : [data.guild]

    return new Promise(function(resolve, reject) {
      this.db.query(query, values, "one").then((data) => resolve(data)).catch((e) => {
        winston.error(e)
        reject(e)
      })
    })
  }

  has(data) {
    return Boolean(this.quotes.get(data.guild).find((quote) => {
      return quote.id === data.id
    }))
  }
}
