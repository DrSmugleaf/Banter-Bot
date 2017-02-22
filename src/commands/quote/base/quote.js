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
    await this.db.query("CREATE TABLE IF NOT EXISTS quotes (id BIGSERIAL PRIMARY KEY, text TEXT, submitter BIGINT, guild BIGINT)")

    const rows = await this.db.query("SELECT id as realid, text, CAST(submitter as TEXT) as submitter, CAST(guild as TEXT) as guild FROM quotes")
    for(var row of rows) {
      const guild = row.guild
      const quotes = this.quotes.get(guild) || new Array()
      const id = quotes[quotes.length - 1] ? quotes[quotes.length - 1].id + 1 : 1
      row.id = id
      quotes.push(row)
      this.quotes.set(guild, quotes)
    }
  }

  add(data) {
    const that = this
    return new Promise(function(resolve, reject) {
      that.db.query(
        "INSERT INTO quotes (text, submitter, guild) VALUES ($1::text, $2::text, $3::bigint)",
        [data.text, data.submitter, data.guild]
      ).then((data) => {
        const quotes = that.quotes.get(data.guild) || new Array()
        const id = quotes[quotes.length - 1] ? quotes[quotes.length - 1].id : 1
        data.id = id
        quotes.push(data)
        that.quotes.set(data.guild, quotes)
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
    const quotes = this.quotes.get(data.guild)

    if(data.id) return quotes.find((quote) => { return quote.id === data.id })
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  has(data) {
    return Boolean(this.quotes.get(data.guild).find((quote) => {
      return quote.id === data.id
    }))
  }
}
